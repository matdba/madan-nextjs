import type { Metadata, Viewport } from "next";
import fontSans from "@/utils/fonts";
import "./globals.css";
import AppContext from "@/components/AppContext";
import { Providers } from "./providers";


export const metadata: Metadata = {
  title: "معدن",
  description: "پنل مدیریت",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`antialiased ${fontSans.className}`} >
        <main className="min-h-dvh min-h-[100lvh] max-w-full mx-auto">
          <AppContext>
            <Providers>
              {children}
            </Providers>
          </AppContext>
        </main>
      </body>
    </html>
  );
}
