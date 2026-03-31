import { Effect } from "effect";
import { withTestabaseFx } from "@/lib/server/test";
import { databaseFx } from "~/server/database/databaseFx";

export default async function globalSetup() {
	const { cleanup } = await withTestabaseFx({
		image: "nhost/postgres:17-20260320-1",
		name: "zbav-seme-e2e-postgres",
		port: 55432,
		template: "e2e",
		databaseFx,
	}).pipe(Effect.runPromise);

	return async () => {
		return cleanup();
	};
}
