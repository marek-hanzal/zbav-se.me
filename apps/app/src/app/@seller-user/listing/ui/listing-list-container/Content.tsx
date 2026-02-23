import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer, VisibleContainer } from "@use-pico/client/ui/container";
import { type FC, Suspense } from "react";
import { CreateButton } from "~/app/@seller-user/draft/ui/button/CreateButton";
import { ContentItem } from "./ContentItem";

export namespace Content {
	export interface Props extends MarkSuspense.Props {
		listingIds: string[];
	}
}

export const Content: FC<Content.Props> = ({ _suspense, listingIds }) => {
	const navigate = useNavigate();
	const locale = useLocale();

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
						<Suspense
							fallback={
								<SpinnerContainer
									data-ui={"MyListing-[SpinnerContainer.listing-fetch]"}
								/>
							}
						>
							<ContentItem listingId={listingId} />
						</Suspense>
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
					onSuccess={(draft) => {
						navigate({
							to: "/$locale/flow/seller/draft/$id/edit",
							params: {
								locale,
								id: draft.id,
							},
						});
					}}
				/>
			</Container>
		</>
	);
};
