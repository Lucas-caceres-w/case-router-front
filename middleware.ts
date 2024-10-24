import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function middleware(req) {
   const jwt = req.cookies.get('session');

   if (req.nextUrl.pathname.includes('/dashboard')) {
      if (jwt === undefined) {
         return NextResponse.redirect(new URL('/login', req.url));
      }
      try {
         const { payload } = await jwtVerify(
            jwt.value,
            new TextEncoder().encode('XCaseRoute$')
         );
         return NextResponse.next();
      } catch (err) {
         console.log(err);
         return NextResponse.redirect(new URL('/login', req.url));
      }
   }

   // Continuar normalmente si no se requiere redirección
   return NextResponse.next();
}
