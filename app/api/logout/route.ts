import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { verify } from 'jsonwebtoken';

export async function GET(req: NextRequest) {
   const cookies = req.cookies.get('session');
   const session = cookies?.value;
   if (!session) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
   }

   try {
      verify(session, 'XCaseRoute$');

      const serialized = serialize('session', '', {
         httpOnly: true,
         maxAge: 0,
         sameSite: 'strict',
         secure: process.env.NODE_ENV === 'production',
         path: '/',
      });
      const response = NextResponse.json({ message: 'Logout successful' });
      response.headers.set('Set-Cookie', serialized);
      return response;
   } catch (err) {
      return NextResponse.json(
         { error: 'Invalid token', details: err.message },
         { status: 403 }
      );
   }
}
