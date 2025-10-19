import { ArrowRightIcon, Button, type useSnapperNav } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";

export namespace NextButton {
	export interface Props extends Button.Props {
		listingNavApi: useSnapperNav.Api;
	}
}

export const NextButton: FC<NextButton.Props> = ({
	listingNavApi,
	...props
}) => {
	const useCreateListingStore = useCreateListingContext();
	const isValid = useCreateListingStore((store) => store.isValid);

	return isValid ? (
		<Button
			iconEnabled={ArrowRightIcon}
			iconPosition={"right"}
			tone={"primary"}
			theme={"dark"}
			size={"lg"}
			onClick={listingNavApi.end}
			label={"Go to submit (button)"}
			{...props}
		/>
	) : (
		<Button
			iconEnabled={ArrowRightIcon}
			iconPosition={"right"}
			tone={"secondary"}
			theme={"dark"}
			size={"lg"}
			onClick={listingNavApi.next}
			{...props}
		/>
	);
};
