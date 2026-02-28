import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer, VisibleContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { CreateButton } from "~/app/@seller-user/draft/ui/button/CreateButton";
import { ContentItemSuspense } from "./ContentItemSuspense";

export namespace Content {
	export interface Props extends MarkSuspense.Props {
		listingIds: string[];
	}
}

export const Content: FC<Content.Props> = ({ _suspense, listingIds }) => {
	return (
		<>
			{listingIds.map((listingId) => {
				return (
					<VisibleContainer
						key={listingId}
						id={listingId}
						data-ui="MyListing-[VisibleContainer]"
						placeholder={() => {
							return <SpinnerContainer />;
						}}
						ui={{
							height: "full",
							width: "full",
							inner: "default",
							round: "default",
						}}
					>
						<ContentItemSuspense listingId={listingId} />
					</VisibleContainer>
				);
			})}

			<Container
				ui={{
					inner: "default",
					height: "full",
				}}
			>
				<CreateButton
					ui={{
						height: "full",
					}}
				/>
			</Container>
		</>
	);
};
