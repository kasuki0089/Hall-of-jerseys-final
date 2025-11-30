"use client";

import { SessionProvider } from "next-auth/react";

export function NextAuthProvider({ children, session = null }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}