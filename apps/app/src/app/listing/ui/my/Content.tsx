import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer, VisibleContainer } from "@use-pico/client/ui/container";
import { tvc } from "@use-pico/cls";
import type { tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCollectionQuery, withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useId, useRef } from "react";
import { CreateButton } from "~/app/draft/button/CreateButton";
import { Hero } from "~/app/listing/ui/Hero";

export namespace Content {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tListingQuery;
	}
}

export const Content: FC<Content.Props> = ({ _suspense, query, ...props }) => {
	/**
	 * This is intentional to trigger parent suspense
	 */
	const listingCollectionQuery = withListingCollectionQuery.useSuspenseQuery(query);
	const listingIdPrefix = useId();
	const containerRef = useRef<HTMLDivElement>(null);

	if (listingCollectionQuery.data.data.length === 0) {
		return null;
	}

	return (
		<Container
			data-ui="MyListing-[Container.content]"
			ref={containerRef}
			ui={{
				layout: "vertical-flex",
				gap: "default",
			}}
			{...props}
		>
			{listingCollectionQuery.data.data.map(({ id: listingId }) => {
				return (
					<VisibleContainer
						key={`${listingIdPrefix}-${listingId}`}
						data-ui="MyListing-[VisibleContainer]"
						scrollerRef={containerRef}
						useProximity
						overscan={4}
						delayMs={200}
						placeholder={(props) => (
							<SpinnerContainer
								data-ui={"MyListing-[SpinnerContainer.placeholder]"}
								data-id={listingId}
								{...props}
							/>
						)}
						className={tvc([
							"h-48 md:h-92",
						])}
						ui={{
							width: "full",
							position: "relative",
							round: "lg",
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
										herImageProps={{
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

			<CreateButton />
		</Container>
	);
};
