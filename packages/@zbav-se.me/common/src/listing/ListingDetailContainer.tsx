import { ArrowRightIcon, Icon, ShowIcon, SpinnerIcon } from "@use-pico/client/icon";
import { Badge, BadgeValue } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { VariantProvider } from "@use-pico/cls";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { CategoryInline } from "@zbav-se.me/common/category";
import type { tGalleryItem, tListing } from "@zbav-se.me/sdk/api/user";
import { withListingScoreCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useEffect, useState } from "react";
import { ScoreContainer } from "./ScoreContainer";

export namespace ListingDetailContainer {
	export interface Props extends Container.Props {
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
	locale,
	listing,
	children,
	withScore,
	parentSheetId,
	tweak,
	...props
}) => {
	const [hero] = listing.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

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
		<VariantProvider
			cls={ThemeCls}
			variant={{
				tone: "unset",
				theme: "unset",
			}}
		>
			<Container
				ui={"ListingDetailContainer-root"}
				layout={children ? "vertical-content-footer" : undefined}
				gap={"xl"}
				height={"content"}
				square={"md"}
				tweak={[
					tweak,
					{
						slot: {
							root: {
								class: [
									"px-0",
									"pb-0",
								],
							},
						},
					},
				]}
				{...props}
			>
				<Container
					ui={"ListingDetailContainer-layout"}
					layout={"vertical-header-content"}
					gap={"sm"}
					height={"content"}
				>
					<Container
						ui={"ListingDetailContainer-image"}
						height={"content"}
						round={"default"}
						position={"relative"}
						tweak={{
							slot: {
								root: {
									class: [
										"h-64",
									],
								},
							},
						}}
					>
						<Badge
							tone={"secondary"}
							theme={"light"}
							snapTo={"top-center"}
							tweak={{
								slot: {
									root: {
										class: [
											"h-fit",
										],
									},
								},
							}}
							size={"xl"}
							round={"default"}
						>
							{toLocaleNumber({
								locale,
								number: listing.price,
								currency: listing.currency,
								currencyDisplay: "narrowSymbol",
								style: "currency",
							})}
						</Badge>

						<Badge
							tone={"secondary"}
							theme={"light"}
							snapTo={"bottom"}
							tweak={{
								slot: {
									root: {
										class: [
											"h-fit",
										],
									},
								},
							}}
							round={"default"}
						>
							{listing.location.address}
						</Badge>

						<HeroImage
							src={hero.upload.url}
							alt={`Hero image for listing ${listing.id}`}
						/>
					</Container>

					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "primary",
							theme: "light",
						}}
					>
						<Container
							ui={"ListingDetailContainer-info"}
							layout={"vertical-flex"}
							gap={"sm"}
							square={"md"}
							tone={"unset"}
							theme={"unset"}
							height={"content"}
						>
							<BadgeValue
								textLabel={"Listing condition (label)"}
								textValue={`Condition - Overall [${listing.condition}] (hint)`}
							/>

							<BadgeValue
								textLabel={"Listing age (label)"}
								textValue={`Condition - Age [${listing.age}] (hint)`}
							/>

							<BadgeValue
								textLabel={"Listing score hint (label)"}
								textValue={
									<withListingMetricsFetchQuery.Suspense
										data={listing.id}
										fallback={<Icon icon={SpinnerIcon} />}
									>
										{({ data }) => {
											return toLocaleNumber({
												locale,
												number: data.score,
												empty: "0",
											});
										}}
									</withListingMetricsFetchQuery.Suspense>
								}
								action={
									<Icon
										icon={ShowIcon}
										size={"sm"}
									/>
								}
								onClick={() => setScore(true)}
							/>

							<BadgeValue
								textLabel={"Listing seller hint (label)"}
								textValue={"- skore + link -"}
								action={<Icon icon={ArrowRightIcon} />}
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
					</VariantProvider>
				</Container>

				{children ? (
					<Container
						ui={"ListingDetailContainer-content"}
						square={"md"}
						height={"content"}
					>
						{children}
					</Container>
				) : null}

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
		</VariantProvider>
	);
};
