import { ArrowRightIcon, Button, type useSnapperNav } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { ListingPageIndex } from "~/app/listing/ui/CreateListing/ListingPageIndex";

export namespace NextButton {
	export interface Props extends Button.Props {
		listingNav: useSnapperNav.Result;
	}
}

export const NextButton: FC<NextButton.Props> = ({ listingNav, ...props }) => {
	const useCreateListingStore = useCreateListingContext();
	const isValid = useCreateListingStore((store) => store.isValid);
	const missing = useCreateListingStore((store) => store.missing);

	const handleNext = () => {
		if (isValid) {
			listingNav.api.end();
		} else {
			const nextMissingPageIndex =
				ListingPageIndex.getNextMissingPageIndex(
					listingNav.state.current,
					missing,
				);

			if (nextMissingPageIndex !== null) {
				listingNav.api.snapTo(nextMissingPageIndex);
				return;
			}
			listingNav.api.next();
		}
	};

	return (
		<Button
			iconEnabled={ArrowRightIcon}
			iconPosition={"right"}
			tone={isValid ? "primary" : "secondary"}
			theme={"dark"}
			size={"lg"}
			onClick={handleNext}
			label={isValid ? "Go to submit (button)" : undefined}
			{...props}
		/>
	);
};
