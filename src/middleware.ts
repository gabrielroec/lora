import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Rotas públicas que não precisam de autenticação
  publicRoutes: ["/site", "/api/uploadthing", "/api/webhook/stripe", "/api/webhook/clerk", "/api/webhook/stripe/connect"],

  async beforeAuth(auth, req) {},

  async afterAuth(auth, req) {
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    const hostname = req.headers;

    const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

    const host = hostname.get("host") || "";

    // Lógica de subdomínio ajustada
    const customSubDomain =
      !host.includes("localhost") && !host.includes(".vercel.app")
        ? host.split(`${process.env.NEXT_PUBLIC_DOMAIN}`).filter(Boolean)[0]
        : null;

    // Regras de redirecionamento
    if (customSubDomain) {
      return NextResponse.rewrite(new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url));
    }

    // Redirecionamento para páginas de autenticação da agência
    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
    }

    // Redirecionamento da página inicial
    if (url.pathname === "/" || (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)) {
      return NextResponse.rewrite(new URL("/site", req.url));
    }

    // Tratamento de rotas da agência e subcontas
    if (url.pathname.startsWith("/agency") || url.pathname.startsWith("/subaccount")) {
      return NextResponse.rewrite(new URL(pathWithSearchParams, req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
