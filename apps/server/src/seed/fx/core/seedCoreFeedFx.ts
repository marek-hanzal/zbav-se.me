import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { feedCreateFx } from "~/@buyer-user/feed/fx/feedCreateFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { seedProgressAdvanceFx, seedProgressLogFx } from "~/seed/fx/progress/seedProgressFx";

export const seedCoreFeedFx = Effect.fn("seedCoreFeedFx")(function* ({
	userId,
	deficit,
}: {
	userId: string;
	deficit: number;
}) {
	const { kysely } = yield* KyselyContextFx;
	if (deficit <= 0) {
		return;
	}

	const locations = yield* tryDbFx(async () =>
		kysely
			.selectFrom("location")
			.select("id")
			.orderBy("query", "asc")
			.limit(Math.max(1, deficit))
			.execute(),
	);

	for (let i = 0; i < deficit; i++) {
		const location = locations[i % Math.max(1, locations.length)];
		yield* feedCreateFx({
			userId,
			name: `seed-${genId()}-${i}`,
			locationId: location?.id ?? null,
			query: {},
		});
		yield* seedProgressAdvanceFx({
			delta: 1,
		});
	}

	yield* seedProgressLogFx({
		message: `Feed generation done (${deficit})`,
	});
});

export type seedCoreFeedFx = ReturnType<typeof seedCoreFeedFx>;
