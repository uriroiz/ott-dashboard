import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if user is authenticated
  const authCookie = request.cookies.get('ott-dashboard-auth');
  
  // If already authenticated, allow access
  if (authCookie?.value === 'authenticated') {
    return NextResponse.next();
  }
  
  // Check for password in query or header
  const password = request.nextUrl.searchParams.get('password') || 
                   request.headers.get('x-password');
  
  const correctPassword = process.env.DASHBOARD_PASSWORD || 'ibba2025';
  
  // If password is correct, set cookie and redirect
  if (password === correctPassword) {
    const response = NextResponse.redirect(new URL(request.nextUrl.pathname, request.url));
    response.cookies.set('ott-dashboard-auth', 'authenticated', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    return response;
  }
  
  // If not authenticated and not providing password, show login page
  if (request.nextUrl.pathname !== '/login.html') {
    const loginUrl = new URL('/login.html', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login.html (the login page itself)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (your static assets)
     */
    '/((?!login\\.html|_next/static|_next/image|favicon\\.ico|assets).*)',
  ],
};

