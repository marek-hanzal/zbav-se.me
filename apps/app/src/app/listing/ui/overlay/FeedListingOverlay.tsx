import { useParams } from "@tanstack/react-router";
import { Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { VariantProvider } from "@use-pico/cls";
import type { tListing } from "@zbav-se.me/sdk/api/session";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC } from "react";
import { RatingToIcon } from "~/app/ui/rating/RatingToIcon";

export namespace FeedListingOverlay {
	export interface Props {
		listing: tListing;
	}
}

export const FeedListingOverlay: FC<FeedListingOverlay.Props> = ({ listing }) => {
	const { locale } = useParams({
		from: "/$locale",
	});

	return (
		<>
			<Badge
				tone={"secondary"}
				theme={"dark"}
				size={"lg"}
				round={"default"}
				snapTo={"top-center"}
				tweak={{
					slot: {
						root: {
							class: [
								"border-none",
								"shadow-none",
							],
						},
					},
				}}
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
