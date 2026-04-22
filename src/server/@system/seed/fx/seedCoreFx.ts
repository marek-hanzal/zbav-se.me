import { Effect } from "effect";
import { SeedProgressContextFx } from "~/server/@system/seed/context/withSeedProgressFx";
import LocationQueries from "~/server/@system/seed/data/location.json" with { type: "json" };
import { seedCoreFeedFx } from "~/server/@system/seed/fx/core/seedCoreFeedFx";
import { seedCoreGalleryFx } from "~/server/@system/seed/fx/core/seedCoreGalleryFx";
import { seedCoreListingFx } from "~/server/@system/seed/fx/core/seedCoreListingFx";
import { seedCoreLocationFx } from "~/server/@system/seed/fx/core/seedCoreLocationFx";
import { seedCoreUploadFx } from "~/server/@system/seed/fx/core/seedCoreUploadFx";
import { ensureSeedUserFx } from "~/server/@system/seed/fx/ensureSeedUserFx";
import { SeedCoreReportSchema } from "~/server/@system/seed/fx/report/SeedCoreReportSchema";
import { withInlineCounts } from "~/server/@system/seed/fx/report/seedReportConsole";
import { withSeedCoreUserCountsFx } from "~/server/@system/seed/fx/report/withSeedCoreUserCountsFx";
import {
	SeedPrimaryCoreTables,
	withSeedTableCountsFx,
} from "~/server/@system/seed/fx/report/withSeedTableCountsFx";
import { userExPatchFx } from "~/user/user-ex/server/fx/userExPatchFx";

export namespace seedCoreFx {
	export interface Props {
		count: number;
		user: string;
		cdn: string;
	}
}

export const seedCoreFx = Effect.fn("seedCoreFx")(function* ({
	count,
	user,
	cdn,
}: seedCoreFx.Props) {
	const progress = yield* SeedProgressContextFx;
	const current = yield* ensureSeedUserFx({
		email: user,
	});

	yield* userExPatchFx({
		userId: current.id,
		patch: {
			locationId: null,
		},
	});

	const beforeGlobal = yield* withSeedTableCountsFx({
		tables: [
			"location",
		],
	});
	const beforeUser = yield* withSeedCoreUserCountsFx({
		userId: current.id,
	});
	const locationCyclesOverride = Number(process.env.SEED_LOCATION_CYCLES ?? 0);
	const locationCycles =
		locationCyclesOverride > 0
			? Math.min(LocationQueries.length, locationCyclesOverride)
			: Math.max(20, Math.min(LocationQueries.length, 180, Math.ceil(count / 4)));

	yield* progress.startPhase({
		name: "Locations",
		total: locationCycles,
	});
	yield* seedCoreLocationFx({
		deficit: locationCycles,
	});
	yield* progress.finishPhase();

	yield* progress.startPhase({
		name: "Uploads",
		total: Math.max(1, count),
	});
	const userUploadIds = yield* seedCoreUploadFx({
		userId: current.id,
		cdn,
		deficit: count,
	});
	yield* progress.finishPhase();

	yield* progress.startPhase({
		name: "Galleries",
		total: Math.max(1, count),
	});
	yield* seedCoreGalleryFx({
		userId: current.id,
		uploadIds: userUploadIds,
		galleryDeficit: count,
		galleryItemDeficit: count,
	});
	yield* progress.finishPhase();

	yield* progress.startPhase({
		name: "Drafts and Listings",
		total: Math.max(1, count * 2),
	});
	yield* seedCoreListingFx({
		userId: current.id,
		uploadIds: userUploadIds,
		draftDeficit: count,
		listingDeficit: count,
	});
	yield* progress.finishPhase();

	yield* progress.startPhase({
		name: "Feeds",
		total: Math.max(1, count),
	});
	yield* seedCoreFeedFx({
		userId: current.id,
		deficit: count,
	});
	yield* progress.finishPhase();

	const locationAfter = yield* withSeedTableCountsFx({
		tables: [
			"location",
		],
	});
	const userAfter = yield* withSeedCoreUserCountsFx({
		userId: current.id,
	});
	const totals = yield* withSeedTableCountsFx({
		tables: SeedPrimaryCoreTables,
	});
	const tables = {
		location: Math.max(0, (locationAfter.location ?? 0) - (beforeGlobal.location ?? 0)),
		upload: Math.max(0, userAfter.upload - beforeUser.upload),
		gallery: Math.max(0, userAfter.gallery - beforeUser.gallery),
		gallery_item: Math.max(0, userAfter.gallery_item - beforeUser.gallery_item),
		draft: Math.max(0, userAfter.draft - beforeUser.draft),
		listing: Math.max(0, userAfter.listing - beforeUser.listing),
		feed: Math.max(0, userAfter.feed - beforeUser.feed),
	};
	yield* progress.log({
		message: `Generated in this run: ${withInlineCounts(tables)}`,
	});
	yield* progress.finishAll();

	const report = SeedCoreReportSchema.parse({
		userId: current.id,
		user,
		count,
		tables,
		totals,
	});

	return report;
});

export type seedCoreFx = ReturnType<typeof seedCoreFx>;
