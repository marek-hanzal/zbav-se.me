import { Effect } from "effect";
import { expect } from "vitest";
import { createToggleBaseContextFx } from "~/test/@buyer/common/fx/createToggleBaseContextFx";
import { runWithTestRuntime } from "~/test/common/fx/runWithTestRuntime";
import { testabase } from "~/test/testabase";

namespace runToggleEntityContractFx {
	export type BaseContext = Effect.Effect.Success<ReturnType<typeof createToggleBaseContextFx>>;

	export interface ToggleContext<Extra> extends BaseContext {
		extra: Extra;
	}

	export interface ToggleProps<Extra, RecordShape, InboxShape, Runtime> {
		databaseName: string;
		userSlug: string;
		createExtraFx?: (context: BaseContext) => Effect.Effect<Extra, unknown, Runtime>;
		toggleOnFx: (context: ToggleContext<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
		toggleOffFx: (context: ToggleContext<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
		recordFx: (
			context: ToggleContext<Extra>,
		) => Effect.Effect<RecordShape | undefined, unknown, Runtime>;
		eventsFx: (context: ToggleContext<Extra>) => Effect.Effect<string[], unknown, Runtime>;
		assertRecordOn: (record: RecordShape, context: ToggleContext<Extra>) => void;
		onEvent: string;
		offEvent: string;
		inboxOnFx?: (
			context: ToggleContext<Extra>,
		) => Effect.Effect<InboxShape | undefined, unknown, Runtime>;
		inboxOffFx?: (
			context: ToggleContext<Extra>,
		) => Effect.Effect<InboxShape | undefined, unknown, Runtime>;
		assertInboxOn?: (inbox: InboxShape, context: ToggleContext<Extra>) => void;
		assertInboxOff?: (inbox: InboxShape, context: ToggleContext<Extra>) => void;
	}
}

export const runToggleEntityContractFx = async <Extra, RecordShape, InboxShape, Runtime>({
	databaseName,
	userSlug,
	createExtraFx,
	toggleOnFx,
	toggleOffFx,
	recordFx,
	eventsFx,
	assertRecordOn,
	onEvent,
	offEvent,
	inboxOnFx,
	inboxOffFx,
	assertInboxOn,
	assertInboxOff,
}: runToggleEntityContractFx.ToggleProps<Extra, RecordShape, InboxShape, Runtime>) => {
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
		} satisfies runToggleEntityContractFx.ToggleContext<Extra>;

		yield* toggleOnFx(context);

		const record = yield* recordFx(context);
		expect(record).toBeDefined();

		if (!record) {
			throw new Error("Expected toggle-on record to exist");
		}

		assertRecordOn(record, context);

		const eventsAfterOn = yield* eventsFx(context);
		expect(eventsAfterOn).toContain(onEvent);

		if (inboxOnFx) {
			const inboxOn = yield* inboxOnFx(context);
			expect(inboxOn).toBeDefined();

			if (!inboxOn) {
				throw new Error("Expected toggle-on inbox to exist");
			}

			assertInboxOn?.(inboxOn, context);
		}

		yield* toggleOffFx(context);

		const recordAfterOff = yield* recordFx(context);
		expect(recordAfterOff).toBeUndefined();

		const eventsAfterOff = yield* eventsFx(context);
		expect(eventsAfterOff).toContain(onEvent);
		expect(eventsAfterOff).toContain(offEvent);

		if (inboxOffFx) {
			const inboxOff = yield* inboxOffFx(context);
			expect(inboxOff).toBeDefined();

			if (!inboxOff) {
				throw new Error("Expected toggle-off inbox to exist");
			}

			assertInboxOff?.(inboxOff, context);
		}
		return undefined;
	}).pipe((effect) =>
		runWithTestRuntime({
			database,
			effect,
		}),
	);
};
