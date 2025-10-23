import type { Icon } from "@use-pico/client";
import type { createListingStore } from "~/app/listing/store/createListingStore";
import { AgeIcon } from "~/app/ui/icon/AgeIcon";
import { CategoryGroupIcon } from "~/app/ui/icon/CategoryGroupIcon";
import { CategoryIcon } from "~/app/ui/icon/CategoryIcon";
import { ConditionIcon } from "~/app/ui/icon/ConditionIcon";
import { LocationIcon } from "~/app/ui/icon/LocationIcon";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";

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
			index: 8,
			icon: LocationIcon,
		},
	};
}
