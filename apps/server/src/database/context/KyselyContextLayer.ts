import { Layer } from "effect";
import { type KyselyContext, KyselyContextFx } from "~/database/context/KyselyContextFx";

export const KyselyContextLayer = (database: KyselyContext) => {
	return Layer.succeed(KyselyContextFx, database);
};
