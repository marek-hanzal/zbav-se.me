import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { translator } from "@use-pico/common";

const translationFn = createIsomorphicFn()
	.server(async (locale: string) => {
		translator.push(
			(await import(`../translation/${locale}.yaml`)).default,
		);
	})
	.client(async (locale: string) => {
		translator.push(
			(await import(`../translation/${locale}.yaml`)).default,
		);
	});

export const Route = createFileRoute("/$locale")({
	async loader({ params: { locale } }) {
		try {
			console.log("loader", locale);
			await translationFn(locale);
		} catch (e) {
			console.error(e);
		}
	},
});
