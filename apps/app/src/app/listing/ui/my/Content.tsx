import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer, VisibleContainer } from "@use-pico/client/ui/container";
import type { tListingQuery } from "@zbav-se.me/sdk/api/buyer-user";
import {
	withListingCollectionQuery,
	withListingFetchQuery,
} from "@zbav-se.me/sdk/query/buyer-user/listing";
import type { FC } from "react";
import { CreateButton } from "~/app/@seller-user/draft/button/CreateButton";
import { Hero } from "~/app/listing/ui/Hero";

export namespace Content {
	export interface Props extends MarkSuspense.Props {
		query: tListingQuery;
	}
}

export const Content: FC<Content.Props> = ({ _suspense, query }) => {
	const navigate = useNavigate();
	const locale = useLocale();
	/**
	 * This is intentional to trigger parent suspense
	 */
	const listingCollectionQuery = withListingCollectionQuery.useSuspenseQuery(query);

	if (listingCollectionQuery.data.data.length === 0) {
		return null;
	}

	return (
		<>
			{listingCollectionQuery.data.data.map(({ id: listingId }) => {
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
						<withListingFetchQuery.Suspense
							data={{
								where: {
									id: listingId,
								},
							}}
							fallback={
								<SpinnerContainer
									data-ui={"MyListing-[SpinnerContainer.listing-fetch]"}
								/>
							}
						>
							{({ data: listing }) => {
								return (
									<Hero
										data-ui={"MyListing-[Hero]"}
										listing={listing}
										feedId={undefined}
										withScore={false}
										tools={[
											"hero",
										]}
										heroImageProps={{
											ui: {
												round: "default",
											},
										}}
									/>
								);
							}}
						</withListingFetchQuery.Suspense>
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
							to: "/$locale/ui/seller/draft/$id/edit",
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
