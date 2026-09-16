import { NextRequest, NextResponse } from "next/server";

// O middleware roda no Edge Runtime, onde o módulo "crypto" do Node não
// está disponível — por isso a checagem aqui é só "o cookie existe?".
// A validação criptográfica de verdade (tokenAdminValido) acontece de
// novo dentro da página do dashboard, que roda no runtime Node.
export function middleware(req: NextRequest) {
  const temSessao = req.cookies.has("esparta_admin_session");

  if (!temSessao) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
