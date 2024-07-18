import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import type { PropsWithChildren } from "react";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "zbav-se.me",
  description: "Simple person-to-person marketplace",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
