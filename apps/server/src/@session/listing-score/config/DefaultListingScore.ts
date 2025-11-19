import type { ListingScoreType } from "../fx/ListingScoreContextFx";

export const DefaultListingScore: Record<ListingScoreType, number> = {
	listing: 1,
	view: 5,
	cart: 15,
	//
	ignore: -5,
	flag: -15,
};
