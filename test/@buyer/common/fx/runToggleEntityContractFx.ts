import { Effect } from "effect";
import { expect } from "vitest";
import { auth } from "~/server/auth/auth";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;
type TestListing = Effect.Effect.Success<ReturnType<typeof createListingFx>>;
type TestUsers = Effect.Effect.Success<ReturnType<typeof createUsersFx>>;

export namespace runToggleEntityContractFx {
	export interface BaseContext {
		database: TestDatabase;
		listing: TestListing;
		users: TestUsers;
	}

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

	export interface ErrorProps<Extra, Runtime> {
		databaseName: string;
		userSlug: string;
		createExtraFx?: (context: BaseContext) => Effect.Effect<Extra, unknown, Runtime>;
		beforeFx?: (context: ToggleContext<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
		errorFx: (context: ToggleContext<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
		assertAfterFx?: (context: ToggleContext<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
	}
}

const createBaseContextFx = ({
	database,
	userSlug,
}: {
	database: TestDatabase;
	userSlug: string;
}) =>
	Effect.gen(function* () {
		const { api } = auth(() => database.dialect);
		const users = yield* createUsersFx({
			api,
			slug: userSlug,
		});
		const listing = yield* createListingFx(users.seller.id);

		return {
			database,
			listing,
			users,
		} satisfies runToggleEntityContractFx.BaseContext;
	});

const runWithRuntimeFx = <A, E, R>(database: TestDatabase, effect: Effect.Effect<A, E, R>) =>
	Effect.runPromise(effect.pipe(withRuntimeFx(database)) as Effect.Effect<A, E, never>);

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
		const baseContext = yield* createBaseContextFx({
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
	}).pipe((effect) => runWithRuntimeFx(database, effect));
};

export const runToggleEntityErrorContractFx = async <Extra, Runtime>({
	databaseName,
	userSlug,
	createExtraFx,
	beforeFx,
	errorFx,
	assertAfterFx,
}: runToggleEntityContractFx.ErrorProps<Extra, Runtime>) => {
	const database = await testabase(databaseName);

	return Effect.gen(function* () {
		const baseContext = yield* createBaseContextFx({
			database,
			userSlug,
		});
		const extra = createExtraFx ? yield* createExtraFx(baseContext) : (undefined as Extra);
		const context = {
			...baseContext,
			extra,
		} satisfies runToggleEntityContractFx.ToggleContext<Extra>;

		if (beforeFx) {
			yield* beforeFx(context);
		}

		const result = yield* Effect.either(errorFx(context));
		expectErrorFx(result);

		if (assertAfterFx) {
			yield* assertAfterFx(context);
		}
		return undefined;
	}).pipe((effect) => runWithRuntimeFx(database, effect));
};
