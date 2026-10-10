import { Effect } from "effect";
import { createToggleBaseContextFx } from "~/test/@buyer/common/fx/createToggleBaseContextFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { runWithTestRuntimeFn } from "~/test/common/fx/runWithTestRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

namespace runToggleEntityErrorContractFn {
	export type BaseContext = Effect.Success<ReturnType<typeof createToggleBaseContextFx>>;

	export interface ToggleContext<Extra> extends BaseContext {
		extra: Extra;
	}

	export interface Props<Extra, Runtime> {
		databaseName: string;
		userSlug: string;
		expectedError: expectTaggedErrorFn.Props;
		createExtraFx?: (context: BaseContext) => Effect.Effect<Extra, unknown, Runtime>;
		beforeFx?: (context: ToggleContext<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
		errorFx: (context: ToggleContext<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
		assertAfterFx?: (context: ToggleContext<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
	}
}

export const runToggleEntityErrorContractFn = async <Extra, Runtime>({
	databaseName,
	userSlug,
	expectedError,
	createExtraFx,
	beforeFx,
	errorFx,
	assertAfterFx,
}: runToggleEntityErrorContractFn.Props<Extra, Runtime>) => {
	const database = await testabaseFn(databaseName);

	return Effect.gen(function* () {
		const baseContext = yield* createToggleBaseContextFx({
			database,
			userSlug,
		});
		const extra = createExtraFx ? yield* createExtraFx(baseContext) : (undefined as Extra);
		const context = {
			...baseContext,
			extra,
		} satisfies runToggleEntityErrorContractFn.ToggleContext<Extra>;

		if (beforeFx) {
			yield* beforeFx(context);
		}

		const result = yield* Effect.result(errorFx(context));
		expectTaggedErrorFn(result, expectedError);

		if (assertAfterFx) {
			yield* assertAfterFx(context);
		}

		return undefined;
	}).pipe((effect) =>
		runWithTestRuntimeFn({
			database,
			effect,
		}),
	);
};
