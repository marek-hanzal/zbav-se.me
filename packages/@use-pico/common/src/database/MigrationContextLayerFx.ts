import { type Effect, Layer } from "effect";
import { type MigrationContext, MigrationContextFx } from "./MigrationContextFx";

export const MigrationContextLayerFx = <E, R>(
	migrationsFx: Effect.Effect<MigrationContext, E, R>,
) => {
	return Layer.effect(MigrationContextFx, migrationsFx);
};
