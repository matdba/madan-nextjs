"use client";

import { SessionProvider } from "next-auth/react";

export default function AppContext({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
