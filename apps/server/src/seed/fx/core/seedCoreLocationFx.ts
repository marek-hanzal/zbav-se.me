import { Effect } from "effect";
import { locationAutocompleteFx } from "~/@session/location/fx/locationAutocompleteFx";
import { SeedProgressContextFx } from "~/seed/context/SeedProgressContextFx";
import Queries from "~/seed/data/location.json";

export const seedCoreLocationFx = Effect.fn("seedCoreLocationFx")(function* ({
	deficit,
}: {
	deficit: number;
}) {
	const progress = yield* SeedProgressContextFx;

	if (deficit <= 0) {
		return;
	}

	let cycles = 0;
	while (cycles < deficit) {
		const query = Queries[cycles % Queries.length] ?? "Praha";
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
