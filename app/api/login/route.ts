import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { Login } from '@/utils/api/users';

export async function POST(req: NextRequest) {
   try {
      const { username, password } = await req.json(); // Parseamos el body de la request
      const data = await Login(username, password); // Llamada directa sin necesitar .json()
      const json = await data.json();
      
      if (!data) {
         return NextResponse.json(
            { message: 'Credenciales inválidas' },
            { status: 401 }
         );
      }
      const expire = 1 * 24 * 60 * 60;
      // Creación del token JWT
      const token = jwt.sign(
         {
            id: json.id,
            username: json.username,
            name: json.name,
            email: json.email,
            rol: json.rol,
         },
         'XCaseRoute$', // clave secreta
         { expiresIn: '1d' }
      );

      // Serialización de la cookie
      const serialized = serialize('session', token, {
         httpOnly: true, // Mejor dejar httpOnly como true por razones de seguridad
         maxAge: expire,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'strict',
         path: '/',
      });

      // Establece la cookie en la respuesta
      const response = NextResponse.json({ message: 'Successfully login' });
      response.headers.set('Set-Cookie', serialized);
      return response;
   } catch (error) {
      console.error('Error al loguearse:', error);
      return NextResponse.json(
         { error: 'Error al loguearse' },
         { status: 500 }
      );
   }
}
