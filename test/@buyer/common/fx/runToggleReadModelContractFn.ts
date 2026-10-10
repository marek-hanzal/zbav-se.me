import { Effect } from "effect";
import { expect } from "vitest";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import type { CountSchema } from "~/query/schema/CountSchema";
import { createToggleBaseContextFx } from "~/test/@buyer/common/fx/createToggleBaseContextFx";
import { expectErrorFn } from "~/test/common/fx/expectErrorFn";
import { runWithTestRuntimeFn } from "~/test/common/fx/runWithTestRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

namespace runToggleReadModelContractFn {
	export type BaseContext = Effect.Success<ReturnType<typeof createToggleBaseContextFx>>;

	export interface Context<Extra> extends BaseContext {
		extra: Extra;
	}

	export type CountShape = CountSchema.Type;

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
		) => Effect.Effect<runToggleReadModelContractFn.CountShape, unknown, Runtime>;
		filteredCollectionFx: (
			context: Context<Extra>,
			userId: string,
			itemId: string,
		) => Effect.Effect<CollectionItemShape[], unknown, Runtime>;
		filteredCountFx: (
			context: Context<Extra>,
			userId: string,
		) => Effect.Effect<runToggleReadModelContractFn.CountShape, unknown, Runtime>;
		assertFetchedFn: (item: FetchItemShape, context: Context<Extra>) => void;
	}
}

export const runToggleReadModelContractFn = async <
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
	assertFetchedFn,
}: runToggleReadModelContractFn.Props<Extra, CollectionItemShape, FetchItemShape, Runtime>) => {
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
		} satisfies runToggleReadModelContractFn.Context<Extra>;

		yield* toggleOnFx(context);

		const collection = yield* collectionFx(context, context.users.buyer.id);
		expect(collection).toHaveLength(1);

		const fetched = yield* fetchFx(context, context.users.buyer.id);
		assertFetchedFn(fetched, context);

		const count = yield* countFx(context, context.users.buyer.id);
		expect(count).toBe(1);

		const filteredCollection = yield* filteredCollectionFx(
			context,
			context.users.buyer.id,
			fetched.id,
		);
		expect(filteredCollection).toHaveLength(1);
		expect(filteredCollection[0]?.id).toBe(fetched.id);

		const filteredCount = yield* filteredCountFx(context, context.users.buyer.id);
		expect(filteredCount).toBe(1);

		const strangerCollection = yield* collectionFx(context, context.users.stranger.id);
		expect(strangerCollection).toEqual([]);

		yield* toggleOffFx(context);

		const afterCollection = yield* collectionFx(context, context.users.buyer.id);
		const afterCount = yield* countFx(context, context.users.buyer.id);
		const afterFetch = yield* Effect.result(fetchFx(context, context.users.buyer.id));

		expect(afterCollection).toEqual([]);
		expect(afterCount).toBe(0);
		expectErrorFn(afterFetch);
		return undefined;
	}).pipe((effect) =>
		runWithTestRuntimeFn({
			database,
			effect,
		}),
	);
};
