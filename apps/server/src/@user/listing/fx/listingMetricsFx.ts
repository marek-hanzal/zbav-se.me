import { Effect } from "effect";
import { ListingMetricsSchema } from "~/app/listing/schema/ListingMetricsSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace listingMetricsFx {
	export interface Props {
		listingId: string;
	}
}

export const listingMetricsFx = ({ listingId }: listingMetricsFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const score = yield* Effect.tryPromise(async () => {
			return database
				.selectFrom("listing_score as ls")
				.where("ls.listingId", "=", listingId)
				.select((eb) => [
					eb.fn
						.sum<number>(
							eb.case().when("ls.type", "=", "listing").then(1).else(0).end(),
						)
						.as("listing"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "listing")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("listingScore"),
					//
					eb.fn
						.sum<number>(eb.case().when("ls.type", "=", "view").then(1).else(0).end())
						.as("views"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "view")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("viewsScore"),
					//
					eb.fn
						.sum<number>(
							eb.case().when("ls.type", "=", "favourite").then(1).else(0).end(),
						)
						.as("favourite"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "favourite")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("favouriteScore"),
					//
					eb.fn
						.sum<number>(eb.case().when("ls.type", "=", "ignore").then(1).else(0).end())
						.as("ignore"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "ignore")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("ignoreScore"),
					//
					eb.fn
						.sum<number>(eb.case().when("ls.type", "=", "flag").then(1).else(0).end())
						.as("flag"),
					eb.fn
						.sum<number>(
							eb
								.case()
								.when("ls.type", "=", "flag")
								.then(eb.ref("ls.score"))
								.else(0)
								.end(),
						)
						.as("flagScore"),
					eb.fn.sum<number>("ls.score").as("score"),
				])
				.executeTakeFirst();
		});

		return ListingMetricsSchema.parse(score);
	});
};

export type listingMetricsFx = ReturnType<typeof listingMetricsFx>;
