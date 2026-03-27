import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";

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
				.select((eb) => eb.fn.countAll<number>().as("total"))
				.where("userId", "=", userId)
				.executeTakeFirstOrThrow(),
		),
		tryDbFx(async () =>
			kysely
				.selectFrom("gallery")
				.select((eb) => eb.fn.countAll<number>().as("total"))
				.where("userId", "=", userId)
				.executeTakeFirstOrThrow(),
		),
		tryDbFx(async () =>
			kysely
				.selectFrom("draft")
				.select((eb) => eb.fn.countAll<number>().as("total"))
				.where("userId", "=", userId)
				.executeTakeFirstOrThrow(),
		),
		tryDbFx(async () =>
			kysely
				.selectFrom("listing")
				.select((eb) => eb.fn.countAll<number>().as("total"))
				.where("userId", "=", userId)
				.executeTakeFirstOrThrow(),
		),
		tryDbFx(async () =>
			kysely
				.selectFrom("feed")
				.select((eb) => eb.fn.countAll<number>().as("total"))
				.where("userId", "=", userId)
				.executeTakeFirstOrThrow(),
		),
		tryDbFx(async () =>
			kysely
				.selectFrom("gallery_item as gi")
				.innerJoin("gallery as g", "g.id", "gi.galleryId")
				.select((eb) => eb.fn.countAll<number>().as("total"))
				.where("g.userId", "=", userId)
				.executeTakeFirstOrThrow(),
		),
	]);

	return {
		upload: Number(upload.total ?? 0),
		gallery: Number(gallery.total ?? 0),
		gallery_item: Number(galleryItem.total ?? 0),
		draft: Number(draft.total ?? 0),
		listing: Number(listing.total ?? 0),
		feed: Number(feed.total ?? 0),
	} satisfies SeedCoreUserCounts;
});

export type withSeedCoreUserCountsFx = ReturnType<typeof withSeedCoreUserCountsFx>;
