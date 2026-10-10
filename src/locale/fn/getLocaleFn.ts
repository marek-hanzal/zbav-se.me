import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { defaultLocale, locales } from "~/locales";

export const getLocaleFn = createServerFn().handler(async () => {
	const { pick } = await import("@escapace/accept-language-parser");

	const [locale] = pick(getRequestHeader("accept-language") ?? defaultLocale, locales, {
		type: "lookup",
	});

	return locale ?? defaultLocale;
});
