import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common";

export const Route = createFileRoute("/$locale")({
	async beforeLoad() {
		const { bootstrap } = await import("~/app/database/kysely");
		await bootstrap();
	},
	async loader({ params: { locale } }) {
		try {
			translator.push(
				(await import(`../translation/${locale}.yaml`)).default,
			);
		} catch (_) {
			// console.error(e);
		}
	},
});
