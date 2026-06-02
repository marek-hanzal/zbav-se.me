import type { FC } from "react";
import { SpinnerContainer } from "@/lib/client/spinner";
import { FlowContainer } from "~/common/ui/container";

export namespace PublicListingPagePending {
	export interface Props extends FlowContainer.Props {
		//
	}
}

export const PublicListingPagePending: FC<PublicListingPagePending.Props> = (props) => {
	return (
		<FlowContainer
			data-ui={"PublicListingPagePending"}
			{...props}
		>
			<SpinnerContainer />
		</FlowContainer>
	);
};
