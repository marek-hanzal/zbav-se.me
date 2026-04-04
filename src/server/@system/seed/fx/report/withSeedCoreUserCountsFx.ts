import { Effect } from "effect";
import { sql } from "kysely";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

export interface SeedCoreUserCounts {
	upload: number;
	gallery: number;
	gallery_item: number;
	draft: number;
	listing: number;
	feed: number;
}

export const withSeedCoreUserCountsFx = Effect.fn("withSeedCoreUserCountsFx")(function* ({
	userId,
}: {
	userId: string;
}) {
	const { kysely } = yield* KyselyContextFx;

	const [upload, gallery, draft, listing, feed, galleryItem] = yield* Effect.all([
		tryDbFx(async () =>
			kysely
				.selectFrom("upload")
				.select(sql<number>`count(*)::int`.as("total"))
				.where("userId", "=", userId)
				.executeTakeFirstOrThrow(),
		),
		tryDbFx(async () =>
			kysely
				.selectFrom("gallery")
				.select(sql<number>`count(*)::int`.as("total"))
				.where("userId", "=", userId)
				.executeTakeFirstOrThrow(),
		),
		tryDbFx(async () =>
			kysely
				.selectFrom("draft")
				.select(sql<number>`count(*)::int`.as("total"))
				.where("userId", "=", userId)
				.executeTakeFirstOrThrow(),
		),
		tryDbFx(async () =>
			kysely
				.selectFrom("listing")
				.select(sql<number>`count(*)::int`.as("total"))
				.where("userId", "=", userId)
				.executeTakeFirstOrThrow(),
		),
		tryDbFx(async () =>
			kysely
				.selectFrom("feed")
				.select(sql<number>`count(*)::int`.as("total"))
				.where("userId", "=", userId)
				.executeTakeFirstOrThrow(),
		),
		tryDbFx(async () =>
			kysely
				.selectFrom("gallery_item as gi")
				.innerJoin("gallery as g", "g.id", "gi.galleryId")
				.select(sql<number>`count(*)::int`.as("total"))
				.where("g.userId", "=", userId)
				.executeTakeFirstOrThrow(),
		),
	]);

	return {
		upload: upload.total ?? 0,
		gallery: gallery.total ?? 0,
		gallery_item: galleryItem.total ?? 0,
		draft: draft.total ?? 0,
		listing: listing.total ?? 0,
		feed: feed.total ?? 0,
	} satisfies SeedCoreUserCounts;
});

export type withSeedCoreUserCountsFx = ReturnType<typeof withSeedCoreUserCountsFx>;
