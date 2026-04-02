import { Effect } from "effect";
import { expect } from "vitest";
import { EntitySchema } from "@/lib/common/schema/EntitySchema";
import { auth } from "~/server/auth/auth";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;
type TestListing = Effect.Effect.Success<ReturnType<typeof createListingFx>>;
type TestUsers = Effect.Effect.Success<ReturnType<typeof createUsersFx>>;

export namespace runToggleReadModelContractFx {
	export interface BaseContext {
		database: TestDatabase;
		listing: TestListing;
		users: TestUsers;
	}

	export interface Context<Extra> extends BaseContext {
		extra: Extra;
	}

	export interface CountShape {
		total: number;
		where: number;
	}

	export interface Props<
		Extra,
		CollectionItemShape extends EntitySchema.Type,
		FetchItemShape extends EntitySchema.Type,
		Runtime,
	> {
		databaseName: string;
		userSlug: string;
		createExtraFx?: (context: BaseContext) => Effect.Effect<Extra, unknown, Runtime>;
		toggleOnFx: (context: Context<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
		toggleOffFx: (context: Context<Extra>) => Effect.Effect<unknown, unknown, Runtime>;
		collectionFx: (
			context: Context<Extra>,
			userId: string,
		) => Effect.Effect<CollectionItemShape[], unknown, Runtime>;
		fetchFx: (
			context: Context<Extra>,
			userId: string,
		) => Effect.Effect<FetchItemShape, unknown, Runtime>;
		countFx: (
			context: Context<Extra>,
			userId: string,
		) => Effect.Effect<runToggleReadModelContractFx.CountShape, unknown, Runtime>;
		filteredCollectionFx: (
			context: Context<Extra>,
			userId: string,
			itemId: string,
		) => Effect.Effect<CollectionItemShape[], unknown, Runtime>;
		filteredCountFx: (
			context: Context<Extra>,
			userId: string,
		) => Effect.Effect<runToggleReadModelContractFx.CountShape, unknown, Runtime>;
		assertFetched: (item: FetchItemShape, context: Context<Extra>) => void;
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
		} satisfies runToggleReadModelContractFx.BaseContext;
	});

const runWithRuntimeFx = <A, E, R>(database: TestDatabase, effect: Effect.Effect<A, E, R>) =>
	Effect.runPromise(effect.pipe(withRuntimeFx(database)) as Effect.Effect<A, E, never>);

export const runToggleReadModelContractFx = async <
	Extra,
	CollectionItemShape extends EntitySchema.Type,
	FetchItemShape extends EntitySchema.Type,
	Runtime,
>({
	databaseName,
	userSlug,
	createExtraFx,
	toggleOnFx,
	toggleOffFx,
	collectionFx,
	fetchFx,
	countFx,
	filteredCollectionFx,
	filteredCountFx,
	assertFetched,
}: runToggleReadModelContractFx.Props<Extra, CollectionItemShape, FetchItemShape, Runtime>) => {
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
		} satisfies runToggleReadModelContractFx.Context<Extra>;

		yield* toggleOnFx(context);

		const collection = yield* collectionFx(context, context.users.buyer.id);
		expect(collection).toHaveLength(1);

		const fetched = yield* fetchFx(context, context.users.buyer.id);
		assertFetched(fetched, context);

		const count = yield* countFx(context, context.users.buyer.id);
		expect(count.total).toBe(1);

		const filteredCollection = yield* filteredCollectionFx(
			context,
			context.users.buyer.id,
			fetched.id,
		);
		expect(filteredCollection).toHaveLength(1);
		expect(filteredCollection[0]?.id).toBe(fetched.id);

		const filteredCount = yield* filteredCountFx(context, context.users.buyer.id);
		expect(filteredCount.where).toBe(1);

		const strangerCollection = yield* collectionFx(context, context.users.stranger.id);
		expect(strangerCollection).toEqual([]);

		yield* toggleOffFx(context);

		const afterCollection = yield* collectionFx(context, context.users.buyer.id);
		const afterCount = yield* countFx(context, context.users.buyer.id);
		const afterFetch = yield* Effect.either(fetchFx(context, context.users.buyer.id));

		expect(afterCollection).toEqual([]);
		expect(afterCount.total).toBe(0);
		expectErrorFx(afterFetch);
		return undefined;
	}).pipe((effect) => runWithRuntimeFx(database, effect));
};
