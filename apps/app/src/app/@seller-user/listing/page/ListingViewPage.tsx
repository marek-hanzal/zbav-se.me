import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/seller-user/listing";
import type { FC } from "react";

export namespace ListingViewPage {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingViewPage: FC<ListingViewPage.Props> = ({
	_suspense,
	listingId,
	...props
}) => {
	const locale = useLocale();
	const listingQuery = withListingFetchQuery.useSuspenseQuery({
		where: {
			id: listingId,
		},
	});

	return (
		<Container {...props}>
			<div className={"flex flex-col gap-2 px-4"}>
				<div>
					<PriceInline
						locale={locale}
						price={listingQuery.data.price}
						currency={listingQuery.data.currency}
					/>
				</div>
				{listingQuery.data.location.address}

				<LinkTo
					to={"/$locale/flow/home"}
					params={{
						locale,
					}}
				>
					[Dashboard]
				</LinkTo>

				{listingQuery.data.gallery.items.map((image) => (
					<img
						key={image.id}
						className={"w-full"}
						src={image.upload.url}
						alt={image.id}
					/>
				))}
			</div>
		</Container>
	);
};
