import { Context, Effect } from "effect";
import { DefaultListingScoreContext } from "../config/DefaultListingScoreContext";

export type ListingScoreType = "listing" | "ignore" | "view" | "cart" | "flag";

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
