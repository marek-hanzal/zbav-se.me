import { withTestabaseFx } from "@use-pico/server/test";
import { Effect } from "effect";
import { database } from "~/database";

export default async function globalSetup() {
	return withTestabaseFx({
		image: "nhost/postgres:17-20260320-1",
		name: "zbav-seme-test-postgres",
		port: 55432,
		template: "test",
		databaseFx: database,
	}).pipe(Effect.runPromise);
}
