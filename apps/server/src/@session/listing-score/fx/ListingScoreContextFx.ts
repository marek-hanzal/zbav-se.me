import { Context, Effect } from "effect";

export type ListingScoreType = "listing" | "ignore" | "view" | "cart" | "flag";

export type ListingScoreContext = Record<ListingScoreType, number>;

export class ListingScoreContextFx extends Context.Tag("ListingScoreContextFx")<
	ListingScoreContextFx,
	ListingScoreContext
>() {
	//
}

export const ListingScoreContextProvider = (scores: ListingScoreContext) => {
	return Effect.provideService(ListingScoreContextFx, scores);
};
