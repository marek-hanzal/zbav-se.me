import { Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { VariantProvider } from "@use-pico/cls";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { RatingToIcon } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace FeedListingOverlay {
	export interface Props {
		locale: string;
		listing: tListing;
	}
}

export const FeedListingOverlay: FC<FeedListingOverlay.Props> = ({ locale, listing }) => {
	return (
		<>
			<Badge
				ui={"FeedListingOverlay-price"}
				tone={"secondary"}
				theme={"light"}
				size={"lg"}
				round={"default"}
				snapTo={"top-center"}
			>
				{listing.price > 0 ? (
					<PriceInline
						price={listing.price}
						locale={locale}
						currency={listing.currency}
					/>
				) : (
					<Tx label={"Price - free"} />
				)}
			</Badge>

			<Badge
				ui={"FeedListingOverlay-rating"}
				tone={"secondary"}
				size={"lg"}
				round={"full"}
				snapTo={"top-right"}
				tweak={{
					slot: {
						root: {
							class: [
								"p-2",
								"opacity-75",
								"h-fit",
							],
						},
					},
				}}
			>
				<Icon icon={RatingToIcon[listing.condition as RatingToIcon.Value]} />
			</Badge>

			<VariantProvider
				cls={ThemeCls}
				variant={{
					tone: "secondary",
					theme: "light",
				}}
			>
				<Badge
					ui={"FeedListingOverlay-location"}
					size={"lg"}
					round={"default"}
					snapTo={"bottom"}
					tweak={{
						slot: {
							root: {
								class: [
									"opacity-85",
									"overflow-hidden",
								],
							},
						},
					}}
				>
					<Typo
						truncate
						label={listing.location.address}
					/>
				</Badge>
			</VariantProvider>
		</>
	);
};
