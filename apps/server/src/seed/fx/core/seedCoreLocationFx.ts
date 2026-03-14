import { Effect } from "effect";
import { locationAutocompleteFx } from "~/@session/location/fx/locationAutocompleteFx";
import { SeedProgressContextFx } from "~/seed/context/withSeedProgressFx";
import Queries from "~/seed/data/location.json";

const withShuffle = (items: string[]) => {
	const next = items.slice();
	for (let i = next.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		const a = next[i];
		const b = next[j];
		if (!a || !b) {
			continue;
		}
		next[i] = b;
		next[j] = a;
	}
	return next;
};

export const seedCoreLocationFx = Effect.fn("seedCoreLocationFx")(function* ({
	deficit,
}: {
	deficit: number;
}) {
	const progress = yield* SeedProgressContextFx;

	if (deficit <= 0) {
		return;
	}

	const queryPool = withShuffle(Queries);

	let cycles = 0;
	while (cycles < deficit) {
		const query = queryPool[cycles % queryPool.length] ?? "Praha";
		yield* locationAutocompleteFx({
			text: query,
			lang: "cs",
			limit: 5,
		});
		yield* progress.advance({
			delta: 1,
		});

		if ((cycles + 1) % 20 === 0) {
			yield* progress.log({
				message: `Processed location query cycles: ${cycles + 1}`,
			});
		}

		cycles += 1;
	}
});

export type seedCoreLocationFx = ReturnType<typeof seedCoreLocationFx>;
