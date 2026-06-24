/* proxy.ts */
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );


  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Allow access to marketing pages and static assets
  const isMarketingPage = 
    pathname === '/' || 
    pathname.startsWith('/precios') ||
    pathname.startsWith('/nosotros') ||
    pathname.startsWith('/downloads') ||
    pathname.startsWith('/resources') ||
    pathname.startsWith('/terminos');

  const isAuthPage = 
    pathname.startsWith('/login') ||
    pathname.startsWith('/registro') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/update-password');

  const isApiRoute = pathname.startsWith('/api');

  if (!user) {
    if (!isMarketingPage && !isAuthPage && !isApiRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  } else {
    // User is logged in
    const role = user.app_metadata?.role || user.user_metadata?.role || 'parent';
    
    // Determine target dashboard based on role
    let targetDashboard = '/dashboard';
    if (role === 'ceibal_admin') {
      targetDashboard = '/ceibal';
    } else if (role === 'school_admin' || role === 'teacher') {
      targetDashboard = '/school';
    } else if (role === 'enterprise_admin') {
      targetDashboard = '/enterprise';
    }

    // Redirect if on auth pages
    if (isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = targetDashboard;
      return NextResponse.redirect(url);
    }

    // Role-based route protection for dashboards
    const protectedDashboards = ['/dashboard', '/school', '/enterprise', '/ceibal'];
    const currentDashboard = protectedDashboards.find(db => pathname.startsWith(db));

    if (role !== 'admin' && currentDashboard && currentDashboard !== targetDashboard) {
      const url = request.nextUrl.clone();
      url.pathname = targetDashboard;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
