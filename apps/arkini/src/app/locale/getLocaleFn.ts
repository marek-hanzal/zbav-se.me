import { createServerFn } from "@tanstack/react-start";
import { defaultLocale, locales } from "~/locales";

export const getLocaleFn = createServerFn().handler(async () => {
	const { pick } = await import("@escapace/accept-language-parser");
	const { getRequestHeader } = await import("@tanstack/react-start/server");

	const [locale] = pick(getRequestHeader("accept-language") ?? "", locales, {
		type: "lookup",
	});

	return locale ?? defaultLocale;
});
