import type { FC } from "react";
import { Container } from "@/lib/client/container";
import type { MarkSuspense } from "@/lib/client/type";
import { FlowContainer } from "~/common/ui/container";
import { ListingCard } from "./ListingCard";

export namespace PublicListingPage {
	export interface Props extends FlowContainer.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const PublicListingPage: FC<PublicListingPage.Props> = ({
	_suspense,
	listingId,
	...props
}) => {
	return (
		<FlowContainer
			data-ui={"PublicListingPage"}
			{...props}
		>
			<Container
				data-ui-height="full"
				data-ui-width="full"
				data-ui-scroll="vertical"
			>
				<ListingCard
					_suspense={_suspense}
					listingId={listingId}
				/>
			</Container>
		</FlowContainer>
	);
};
