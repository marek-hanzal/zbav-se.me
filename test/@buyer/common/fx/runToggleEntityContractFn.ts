import { Effect } from "effect";
import { expect } from "vitest";
import { createToggleBaseContextFx } from "~/test/@buyer/common/fx/createToggleBaseContextFx";
import { runWithTestRuntimeFn } from "~/test/common/fx/runWithTestRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

namespace runToggleEntityContractFn {
	export type BaseContext = Effect.Success<ReturnType<typeof createToggleBaseContextFx>>;

	export interface ToggleContext<Extra> extends BaseContext {
		extra: Extra;
	}

	export interface ToggleProps<Extra, RecordShape, ActivityShape, Runtime> {
		databaseName: string;
		userSlug: string;
		createExtraFx?: (context: BaseContext) => Effect.Effect<Extra, unknown, Runtime>;
		toggleOnFx: (context: ToggleContext<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
		toggleOffFx: (context: ToggleContext<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
		recordFx: (
			context: ToggleContext<Extra>,
		) => Effect.Effect<RecordShape | undefined, unknown, Runtime>;
		eventsFx: (context: ToggleContext<Extra>) => Effect.Effect<string[], unknown, Runtime>;
		assertRecordOnFn: (record: RecordShape, context: ToggleContext<Extra>) => void;
		onEvent: string;
		offEvent: string;
		activityOnFx?: (
			context: ToggleContext<Extra>,
		) => Effect.Effect<ActivityShape | undefined, unknown, Runtime>;
		activityOffFx?: (
			context: ToggleContext<Extra>,
		) => Effect.Effect<ActivityShape | undefined, unknown, Runtime>;
		assertActivityOnFn?: (activity: ActivityShape, context: ToggleContext<Extra>) => void;
		assertActivityOffFn?: (activity: ActivityShape, context: ToggleContext<Extra>) => void;
	}
}

export const runToggleEntityContractFn = async <Extra, RecordShape, ActivityShape, Runtime>({
	databaseName,
	userSlug,
	createExtraFx,
	toggleOnFx,
	toggleOffFx,
	recordFx,
	eventsFx,
	assertRecordOnFn,
	onEvent,
	offEvent,
	activityOnFx,
	activityOffFx,
	assertActivityOnFn,
	assertActivityOffFn,
}: runToggleEntityContractFn.ToggleProps<Extra, RecordShape, ActivityShape, Runtime>) => {
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
		} satisfies runToggleEntityContractFn.ToggleContext<Extra>;

		yield* toggleOnFx(context);

		const record = yield* recordFx(context);
		expect(record).toBeDefined();

		if (!record) {
			throw new Error("Expected toggle-on record to exist");
		}

		assertRecordOnFn(record, context);

		const eventsAfterOn = yield* eventsFx(context);
		expect(eventsAfterOn).toContain(onEvent);

		if (activityOnFx) {
			const activityOn = yield* activityOnFx(context);
			expect(activityOn).toBeDefined();

			if (!activityOn) {
				throw new Error("Expected toggle-on activity to exist");
			}

			assertActivityOnFn?.(activityOn, context);
		}

		yield* toggleOffFx(context);

		const recordAfterOff = yield* recordFx(context);
		expect(recordAfterOff).toBeUndefined();

		const eventsAfterOff = yield* eventsFx(context);
		expect(eventsAfterOff).toContain(onEvent);
		expect(eventsAfterOff).toContain(offEvent);

		if (activityOffFx) {
			const activityOff = yield* activityOffFx(context);
			expect(activityOff).toBeDefined();

			if (!activityOff) {
				throw new Error("Expected toggle-off activity to exist");
			}

			assertActivityOffFn?.(activityOff, context);
		}
		return undefined;
	}).pipe((effect) =>
		runWithTestRuntimeFn({
			database,
			effect,
		}),
	);
};
