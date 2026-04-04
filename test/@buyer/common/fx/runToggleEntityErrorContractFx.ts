import { Effect } from "effect";
import { createToggleBaseContextFx } from "~/test/@buyer/common/fx/createToggleBaseContextFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { runWithTestRuntime } from "~/test/common/fx/runWithTestRuntime";
import { testabase } from "~/test/testabase";

namespace runToggleEntityErrorContractFx {
	export type BaseContext = Effect.Effect.Success<ReturnType<typeof createToggleBaseContextFx>>;

	export interface ToggleContext<Extra> extends BaseContext {
		extra: Extra;
	}

	export interface Props<Extra, Runtime> {
		databaseName: string;
		userSlug: string;
		expectedError: expectTaggedErrorFx.Props;
		createExtraFx?: (context: BaseContext) => Effect.Effect<Extra, unknown, Runtime>;
		beforeFx?: (context: ToggleContext<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
		errorFx: (context: ToggleContext<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
		assertAfterFx?: (context: ToggleContext<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
	}
}

export const runToggleEntityErrorContractFx = async <Extra, Runtime>({
	databaseName,
	userSlug,
	expectedError,
	createExtraFx,
	beforeFx,
	errorFx,
	assertAfterFx,
}: runToggleEntityErrorContractFx.Props<Extra, Runtime>) => {
	const database = await testabase(databaseName);

	return Effect.gen(function* () {
		const baseContext = yield* createToggleBaseContextFx({
			database,
			userSlug,
		});
		const extra = createExtraFx ? yield* createExtraFx(baseContext) : (undefined as Extra);
		const context = {
			...baseContext,
			extra,
		} satisfies runToggleEntityErrorContractFx.ToggleContext<Extra>;

		if (beforeFx) {
			yield* beforeFx(context);
		}

		const result = yield* Effect.either(errorFx(context));
		expectTaggedErrorFx(result, expectedError);

		if (assertAfterFx) {
			yield* assertAfterFx(context);
		}

		return undefined;
	}).pipe((effect) =>
		runWithTestRuntime({
			database,
			effect,
		}),
	);
};
