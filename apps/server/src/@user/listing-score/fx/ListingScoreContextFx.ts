import { Context, Effect } from "effect";
import { DefaultListingScoreContext } from "~/@user/listing-score/config/DefaultListingScoreContext";

export type ListingScoreType = "listing" | "ignore" | "view" | "favourite" | "flag";

export type ListingScoreContext = Record<ListingScoreType, number>;

export class ListingScoreContextFx extends Context.Tag("ListingScoreContextFx")<
	ListingScoreContextFx,
	ListingScoreContext
>() {
	//
}

export const ListingScoreContextProvider = (
	scores: ListingScoreContext = DefaultListingScoreContext,
) => {
	return Effect.provideService(ListingScoreContextFx, scores);
};
