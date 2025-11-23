import { ArrowRightIcon, Icon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { CategoryInline } from "@zbav-se.me/common/category";
import type { tGalleryItem, tListing, tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingScoreCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, type PropsWithChildren, useEffect } from "react";

export namespace ListingDetailContainer {
	export namespace ScoreBadge {
		export interface Props extends PropsWithChildren {
			listing: tListing;
		}

		export type RenderFn = (props: Props) => React.ReactNode;
	}

	export namespace SellerBadge {
		export interface Props extends PropsWithChildren {
			listing: tListing;
		}

		export type RenderFn = (props: Props) => React.ReactNode;
	}

	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		query: tListingQuery | undefined;
		listing: tListing;
		withScore: boolean;
		renderScoreBadge: ScoreBadge.RenderFn;
		renderSellerBadge: SellerBadge.RenderFn;
	}
}

export const ListingDetailContainer: FC<ListingDetailContainer.Props> = ({
	_suspense,
	locale,
	query,
	listing,
	children,
	withScore,
	renderScoreBadge,
	renderSellerBadge,
	...props
}) => {
	const [hero] = listing.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	const listingMetricsQuery = withListingMetricsFetchQuery.useSuspenseQuery(listing.id);

	const listingScoreCreateMutation = withListingScoreCreateMutation.useMutation();

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

				{renderScoreBadge?.({
					listing,
					children: (
						<BadgeValue
							textLabel={"Listing score hint (label)"}
							textValue={toLocaleNumber({
								locale,
								number: listingMetricsQuery.data.score,
							})}
							action={<Icon icon={ArrowRightIcon} />}
						/>
					),
				})}

				{renderSellerBadge({
					listing,
					children: (
						<BadgeValue
							textLabel={"Listing seller hint (label)"}
							textValue={"- skore + link -"}
							action={<Icon icon={ArrowRightIcon} />}
						/>
					),
				})}

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
		</Container>
	);
};
