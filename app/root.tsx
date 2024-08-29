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
import i18next from "~/i18n/i18next.server";
import "~/tailwind.css?inline";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return jsonHash({
    async locale() {
      return params.locale ?? i18next.getLocale(request);
    },
  });
};

export const handle = {
  i18n: ["common"],
};

export default function App() {
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()} data-pica="true">
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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
