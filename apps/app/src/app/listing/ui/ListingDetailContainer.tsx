import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon, Icon } from "@use-pico/client/icon";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container, ContainerValueList } from "@use-pico/client/ui/container";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type {
	tGallery,
	tListing,
	tListingQuery,
} from "@zbav-se.me/sdk/api/session";
import { withListingScoreCreateMutation } from "@zbav-se.me/sdk/mutation/session";
import { withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/session";
import { type FC, type PropsWithChildren, useEffect } from "react";
import { CategoryInline } from "~/app/category/ui/CategoryInline";
import { HeroImage } from "~/app/ui/img/HeroImage";

export namespace ListingDetailContainer {
	export namespace ScoreBadge {
		export interface Props extends PropsWithChildren {
			listing: tListing;
		}

		export type Render = (props: Props) => React.ReactNode;
	}

	export namespace SellerBadge {
		export interface Props extends PropsWithChildren {
			listing: tListing;
		}

		export type Render = (props: Props) => React.ReactNode;
	}

	export interface Props extends Container.Props {
		query: tListingQuery | undefined;
		listing: tListing;
		withScore: boolean;
		renderScoreBadge: ScoreBadge.Render;
		renderSellerBadge: SellerBadge.Render;
	}
}

export const ListingDetailContainer: FC<ListingDetailContainer.Props> = ({
	query,
	listing,
	children,
	withScore,
	renderScoreBadge,
	renderSellerBadge,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const [hero] = listing.gallery as [
		tGallery,
		...tGallery[],
	];

	const listingMetricsQuery = withListingMetricsFetchQuery.useSuspenseQuery(
		listing.id,
	);

	const listingScoreCreateMutation =
		withListingScoreCreateMutation.useMutation();

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
			layout={"vertical-flex"}
			gap={"md"}
			{...props}
		>
			<Container
				height={"content"}
				tone={"primary"}
				theme={"light"}
				border={"default"}
				shadow={"default"}
				round={"md"}
			>
				<HeroImage
					src={hero.upload.url}
					alt={`Hero image for listing ${listing.id}`}
					className={"w-full h-full object-cover rounded-md"}
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

			<ContainerValueList
				textTitle={"Listing category (label)"}
				textEmpty={""}
				items={[
					listing.category,
				]}
				render={(item) => {
					return <CategoryInline category={item} />;
				}}
			/>

			{children}
		</Container>
	);
};
