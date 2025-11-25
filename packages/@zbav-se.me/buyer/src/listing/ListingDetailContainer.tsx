import { ArrowRightIcon, Icon, ShowIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { CategoryInline } from "@zbav-se.me/common/category";
import type { tGalleryItem, tListing } from "@zbav-se.me/sdk/api/user";
import { withListingScoreCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useEffect, useState } from "react";
import { ScoreContainer } from "./ScoreContainer";

export namespace ListingDetailContainer {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		listing: tListing;
		/**
		 * Should the listing emit the score event?
		 */
		withScore: boolean;
		/**
		 * Used for bottom sheet stacking effect.
		 */
		parentSheetId: string | undefined;
	}
}

export const ListingDetailContainer: FC<ListingDetailContainer.Props> = ({
	_suspense,
	locale,
	listing,
	children,
	withScore,
	parentSheetId,
	...props
}) => {
	const [hero] = listing.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	const listingMetricsQuery = withListingMetricsFetchQuery.useSuspenseQuery(listing.id);

	const listingScoreCreateMutation = withListingScoreCreateMutation.useMutation();

	// TODO Extract scoring into standalone hooks, which will handle also 429s
	useEffect(() => {
		if (!withScore) {
			return;
		}

		const timeoutId = setTimeout(() => {
			listingScoreCreateMutation.mutate({
				listingId: listing.id,
				score: "view",
			});
		}, 2_500);

		return () => clearTimeout(timeoutId);
	}, [
		withScore,
		listing.id,
		listingScoreCreateMutation,
	]);

	const [score, setScore] = useState<boolean>(false);

	return (
		<Container
			layout={"vertical-content-footer"}
			gap={"xl"}
			height={"content"}
			{...props}
		>
			<Container
				layout={"vertical-flex"}
				gap={"sm"}
			>
				<Container
					height={"content"}
					tone={"primary"}
					theme={"light"}
					border={"default"}
					shadow={"default"}
					round={"default"}
				>
					<HeroImage
						round
						src={hero.upload.url}
						alt={`Hero image for listing ${listing.id}`}
					/>
				</Container>

				<BadgeValue
					textLabel={"Listing title (label)"}
					textValue={listing.title}
					textValueProps={{
						truncate: false,
						wrap: "wrap",
					}}
				/>

				<BadgeValue
					textLabel={"Listing price (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listing.price,
						currency: listing.currency,
						currencyDisplay: "narrowSymbol",
						style: "currency",
					})}
				/>

				<BadgeValue
					textLabel={"Listing score hint (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingMetricsQuery.data.score,
					})}
					action={<Icon icon={ShowIcon} />}
					onClick={() => setScore(true)}
				/>

				<BadgeValue
					textLabel={"Listing seller hint (label)"}
					textValue={"- skore + link -"}
					action={<Icon icon={ArrowRightIcon} />}
				/>

				<BadgeValue
					textLabel={"Listing location (label)"}
					textValue={listing.location.address}
					textValueProps={{
						truncate: false,
						wrap: "wrap",
					}}
				/>

				<BadgeValue
					textLabel={"Listing condition (label)"}
					textValue={`Condition - Overall [${listing.condition}] (hint)`}
				/>

				<BadgeValue
					textLabel={"Listing age (label)"}
					textValue={`Condition - Age [${listing.age}] (hint)`}
				/>

				<BadgeValue
					textLabel={"Listing category (label)"}
					textValue={
						<CategoryInline
							category={listing.category}
							tone="secondary"
							theme="light"
						/>
					}
				/>
			</Container>

			{children}

			<BottomSheet
				isOpen={score}
				onClose={() => setScore(false)}
				modalEffectRootId={parentSheetId}
			>
				<withListingMetricsFetchQuery.Suspense
					data={listing.id}
					fallback={<SpinnerContainer />}
				>
					{({ data }) => {
						return (
							<Container square={"md"}>
								<ScoreContainer
									locale={locale}
									listingMetrics={data}
								/>
							</Container>
						);
					}}
				</withListingMetricsFetchQuery.Suspense>
			</BottomSheet>
		</Container>
	);
};
