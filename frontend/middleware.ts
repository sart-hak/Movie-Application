import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const user = request.cookies.get('user')?.value;
  const isAuthenticated = !!(token && user);
  
  const protectedPaths = ['/movies'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  if (request.nextUrl.pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/movies', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
}; 