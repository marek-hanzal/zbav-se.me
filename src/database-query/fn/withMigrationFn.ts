import { Effect } from "effect";
import {
	type MigrationContext,
	MigrationContextFx,
} from "~/database-query/service/MigrationContextFx";

export function withMigrationFn(context: MigrationContext) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(MigrationContextFx, context));
	};
}
