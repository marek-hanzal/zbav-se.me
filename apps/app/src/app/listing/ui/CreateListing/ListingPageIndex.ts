import type { Icon } from "@use-pico/client";
import type { createListingStore } from "~/app/listing/store/createListingStore";
import { AgeIcon } from "../../../../../../../packages/@zbav-se.me/ui/src/icon/AgeIcon";
import { CategoryGroupIcon } from "../../../../../../../packages/@zbav-se.me/ui/src/icon/CategoryGroupIcon";
import { CategoryIcon } from "../../../../../../../packages/@zbav-se.me/ui/src/icon/CategoryIcon";
import { ConditionIcon } from "../../../../../../../packages/@zbav-se.me/ui/src/icon/ConditionIcon";
import { ExpireIcon } from "../../../../../../../packages/@zbav-se.me/ui/src/icon/ExpireIcon";
import { LocationIcon } from "../../../../../../../packages/@zbav-se.me/ui/src/icon/LocationIcon";
import { PhotoIcon } from "../../../../../../../packages/@zbav-se.me/ui/src/icon/PhotoIcon";
import { PriceIcon } from "../../../../../../../packages/@zbav-se.me/ui/src/icon/PriceIcon";

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
