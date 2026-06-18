import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {

  const hostname = request.headers.get('host')?.split(':')[0] || '';
  const url = request.nextUrl.clone();


  // if (hostname.startsWith('admin.')) {
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/admin/dashboard';
      return NextResponse.rewrite(url);
    }
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  // }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp|.*\\.ico).*)',
  ],
};
