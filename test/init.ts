import { Effect } from "effect";
import { withTestabaseFx } from "@/lib/server/test";
import { databaseFx } from "~/server/database/databaseFx";

export default async function globalSetup() {
	return withTestabaseFx({
		image: "nhost/postgres:17-20260320-1",
		name: "zbav-seme-test-postgres",
		port: 55432,
		template: "test",
		databaseFx,
	}).pipe(Effect.runPromise);
}
