export { default } from "next-auth/middleware"

export const config = { 
  matcher: [
    "/adm/:path*",
    "/perfil/:path*"
  ]
}
