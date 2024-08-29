import type { LoaderFunctionArgs } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next/react";
import { jsonHash } from "remix-utils/json-hash";
import i18next from "~/i18next.server";
import "~/tailwind.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return jsonHash({
    async locale() {
      return i18next.getLocale(request);
    },
  });
};

export const handle = {
  i18n: ["common"],
};

export function Root({ children }: { children: React.ReactNode }) {
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet={"utf-8"} />
        <meta
          name={"viewport"}
          content={"width=device-width, initial-scale=1"}
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
