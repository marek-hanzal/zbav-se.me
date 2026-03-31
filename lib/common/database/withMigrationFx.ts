import { Effect } from "effect";
import { type MigrationContext, MigrationContextFx } from "./MigrationContextFx";

export function withMigrationFx(context: MigrationContext) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(MigrationContextFx, context));
	};
}
