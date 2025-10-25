import type { Icon } from "@use-pico/client";
import {
	AgeIcon,
	CategoryGroupIcon,
	CategoryIcon,
	ConditionIcon,
	ExpireIcon,
	LocationIcon,
	PhotoIcon,
	PriceIcon,
} from "@zbav-se.me/ui";
import type { createListingStore } from "~/app/listing/store/createListingStore";

export namespace ListingPageIndex {
	export interface PageInfo {
		index: number;
		icon: Icon.Type;
	}

	export const Page: Record<
		Exclude<createListingStore.Missing, "currency">,
		PageInfo
	> = {
		photos: {
			index: 1,
			icon: PhotoIcon,
		},
		categoryGroup: {
			index: 2,
			icon: CategoryGroupIcon,
		},
		category: {
			index: 3,
			icon: CategoryIcon,
		},
		condition: {
			index: 4,
			icon: ConditionIcon,
		},
		age: {
			index: 5,
			icon: AgeIcon,
		},
		price: {
			index: 6,
			icon: PriceIcon,
		},
		location: {
			index: 7,
			icon: LocationIcon,
		},
		expiresAt: {
			index: 8,
			icon: ExpireIcon,
		},
	};
}
