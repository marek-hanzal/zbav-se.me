import type { MetaFunction } from "@remix-run/node";
import { useTranslation } from "react-i18next";

export const meta: MetaFunction = () => {
  return [{ title: "zbav-se.me" }];
};

export default function Index() {
  const { t } = useTranslation();
  return (
    <div className="bg-slate-100 p-4 font-sans">
      <h1 className="text-3xl">Welcome to Remix {t("bello")}</h1>
      <ul className="mt-4 list-disc space-y-2 pl-6">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/quickstart"
            rel="noreferrer"
          >
            5m Quick Start
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/tutorial"
            rel="noreferrer"
          >
            30m Tutorial
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
