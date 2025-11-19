import { Context, Effect } from "effect";

export type ListingScoreType = "listing" | "ignore" | "view" | "cart" | "flag";

export class ListingScoreContextFx extends Context.Tag("ListingScoreContextFx")<
	ListingScoreContextFx,
	Record<ListingScoreType, number>
>() {
	//
}

export const ListingScoreContextProvider = (scores: Record<ListingScoreType, number>) => {
	return Effect.provideService(ListingScoreContextFx, scores);
};
