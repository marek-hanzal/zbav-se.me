import { Effect } from "effect";
import { expect } from "vitest";
import type { CountSchema } from "@/lib/common/schema";
import type { EntitySchema } from "@/lib/common/schema/EntitySchema";
import { createToggleBaseContextFx } from "~/test/@buyer/common/fx/createToggleBaseContextFx";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { runWithTestRuntime } from "~/test/common/fx/runWithTestRuntime";
import { testabase } from "~/test/testabase";

namespace runToggleReadModelContractFx {
	export type BaseContext = Effect.Effect.Success<ReturnType<typeof createToggleBaseContextFx>>;

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
		const baseContext = yield* createToggleBaseContextFx({
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
		const afterFetch = yield* Effect.either(fetchFx(context, context.users.buyer.id));

		expect(afterCollection).toEqual([]);
		expect(afterCount).toBe(0);
		expectErrorFx(afterFetch);
		return undefined;
	}).pipe((effect) =>
		runWithTestRuntime({
			database,
			effect,
		}),
	);
};
