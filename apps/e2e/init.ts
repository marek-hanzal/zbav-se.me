import { withTestabaseFx } from "@use-pico/server/test";
import { database } from "@zbav-se.me/server/database";
import { Effect } from "effect";

export default async function globalSetup() {
	const cleanup = await withTestabaseFx({
		image: "nhost/postgres:17-20260320-1",
		name: "zbav-seme-e2e-postgres",
		port: 55432,
		template: "e2e",
		databaseFx: database,
	}).pipe(Effect.runPromise);

	return async () => {
		return cleanup();
	};
}
