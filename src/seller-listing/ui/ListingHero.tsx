import type { FC } from "react";
import { useState } from "react";
import { HeroImage } from "~/application-ui/ui/img.exports";
import { getUploadFn } from "~/gallery/fn/getUploadFn";
import type { ListingPriceSchema } from "~/listing/schema/ListingPriceSchema";
import { ListingPrice } from "~/listing/ui/ListingPrice";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withListingQuery } from "~/seller-listing/query/withListingQuery";
import { ListingSheet } from "~/seller-listing/ui/ListingSheet";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { Typo } from "~/ui/ui/Typo";

export namespace ListingHero {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingHero: FC<ListingHero.Props> = ({ _suspense, listingId, ...props }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const [isOpen, setIsOpenFn] = useState(false);
	const hero = getUploadFn(listing.withImageUrl);

	useRenderLogger({
		logger: getRootLoggerFn(),
		name: "ListingHero",
		meta: {
			listingId,
		},
	});

	return (
		<>
			<Container
				data-ui="ListingHero[Container]"
				data-ui-position="relative"
				data-ui-height="content"
				onClick={() => {
					setIsOpenFn(true);
				}}
				{...props}
			>
				<HeroImage
					src={hero}
					alt={`Hero image for listing ${listing.id}`}
					className={"h-42"}
				/>

				<ListingPrice
					price={listing as ListingPriceSchema.Type}
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-snap-to="top-center"
				/>

				<Container
					className={"pointer-events-none"}
					data-ui-snap-to="bottom-center"
					data-ui-inner="default"
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-background="default"
					data-ui-opacity="8"
					data-ui-items="center"
					data-ui-z-index
					data-ui-width="full"
				>
					<Typo
						label={listing.title}
						data-ui-tone="neutral"
						data-ui-theme="light"
						data-ui-color="text"
						data-ui-font="bold"
						data-ui-display="block"
						data-ui-width="full"
						className={[
							"line-clamp-2",
							"text-center",
						]}
					/>
				</Container>
			</Container>

			<ListingSheet
				_suspense={"I know"}
				listing={listing}
				state={{
					value: isOpen,
					setFn: setIsOpenFn,
				}}
			/>
		</>
	);
};
