import { Layer } from "effect";
import { type MigrationContext, MigrationContextFx } from "./MigrationContextFx";

export const MigrationContextLayer = (migrations: MigrationContext) => {
	return Layer.succeed(MigrationContextFx, migrations);
};
