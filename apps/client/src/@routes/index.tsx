import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { defaultLocale, locales } from "~/locales";

const serverFn = createServerFn().handler(async () => {
	const { pick } = await import("@escapace/accept-language-parser");

	const [locale] = pick(getRequestHeader("accept-language") ?? "", locales, {
		type: "lookup",
	});

	return locale ?? defaultLocale;
});

export const Route = createFileRoute("/")({
	async loader() {
		throw redirect({
			to: "/$locale",
			params: {
				locale: await serverFn(),
			},
		});
	},
});
