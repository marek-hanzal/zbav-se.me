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

	export const IconMap: Record<createListingStore.Missing, PageInfo> = {
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
	};

	/**
	 * Get the page index for a missing field
	 */
	export const getPageIndex = (
		missing: createListingStore.Missing,
	): number => {
		return IconMap[missing].index;
	};

	/**
	 * Get the icon for a missing field
	 */
	export const getIcon = (missing: createListingStore.Missing): Icon.Type => {
		return IconMap[missing].icon;
	};

	/**
	 * Get all missing fields sorted by their page index
	 */
	export const getMissingFieldsSorted = (
		missing: createListingStore.Missing[],
	): createListingStore.Missing[] => {
		return [
			...missing,
		].sort((a, b) => getPageIndex(a) - getPageIndex(b));
	};

	/**
	 * Find the next missing field after the current page
	 */
	export const getNextMissingField = (
		currentPageIndex: number,
		missing: createListingStore.Missing[],
	): createListingStore.Missing | null => {
		const sortedMissing = getMissingFieldsSorted(missing);
		return (
			sortedMissing.find(
				(field) => getPageIndex(field) > currentPageIndex,
			) || null
		);
	};

	/**
	 * Find the previous missing field before the current page
	 */
	export const getPreviousMissingField = (
		currentPageIndex: number,
		missing: createListingStore.Missing[],
	): createListingStore.Missing | null => {
		const sortedMissing = getMissingFieldsSorted(missing);
		const reversed = [
			...sortedMissing,
		].reverse();
		return (
			reversed.find((field) => getPageIndex(field) < currentPageIndex) ||
			null
		);
	};

	/**
	 * Get the page index to navigate to for the next missing field
	 */
	export const getNextMissingPageIndex = (
		currentPageIndex: number,
		missing: createListingStore.Missing[],
	): number | null => {
		const nextMissing = getNextMissingField(currentPageIndex, missing);
		return nextMissing ? getPageIndex(nextMissing) : null;
	};

	/**
	 * Get the page index to navigate to for the previous missing field
	 */
	export const getPreviousMissingPageIndex = (
		currentPageIndex: number,
		missing: createListingStore.Missing[],
	): number | null => {
		const previousMissing = getPreviousMissingField(
			currentPageIndex,
			missing,
		);
		return previousMissing ? getPageIndex(previousMissing) : null;
	};
}
