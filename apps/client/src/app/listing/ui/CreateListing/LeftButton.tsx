import { ArrowLeftIcon, Button, type useSnapperNav } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { ListingPageIndex } from "~/app/listing/ui/CreateListing/ListingPageIndex";

export namespace LeftButton {
	export interface Props extends Button.Props {
		listingNav: useSnapperNav.Result;
	}
}

export const LeftButton: FC<LeftButton.Props> = ({ listingNav, ...props }) => {
	const { api: listingNavApi, state: listingNavState } = listingNav;
	const useCreateListingStore = useCreateListingContext();
	const missing = useCreateListingStore((store) => store.missing);

	const handlePrevious = () => {
		const previousMissingPageIndex =
			ListingPageIndex.getPreviousMissingPageIndex(
				listingNavState.current,
				missing,
			);

		if (previousMissingPageIndex !== null) {
			listingNavApi.snapTo(previousMissingPageIndex);
			return;
		}
		listingNavApi.prev();
	};

	return (
		<Button
			iconEnabled={ArrowLeftIcon}
			iconPosition={"left"}
			tone={"secondary"}
			theme={"light"}
			size={"sm"}
			background={false}
			border={false}
			onClick={handlePrevious}
			{...props}
		/>
	);
};
