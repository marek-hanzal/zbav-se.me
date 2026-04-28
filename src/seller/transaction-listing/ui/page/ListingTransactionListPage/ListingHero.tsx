import type { FC } from "react";
import { useState } from "react";
import { Container } from "@/lib/client/container";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense } from "@/lib/client/type";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { getRootLogger } from "~/common/log/getRootLogger";
import { HeroImage } from "~/common/ui/img";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { ListingSheet } from "~/seller/listing/ui/ListingSheet";

export namespace ListingHero {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingHero: FC<ListingHero.Props> = ({ _suspense, listingId, ...props }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const [isOpen, setIsOpen] = useState(false);
	const hero = useUpload(listing.withImageUrl);

	useRenderLogger({
		logger: getRootLogger(),
		name: "ListingHero",
		meta: {
			listingId,
		},
	});

	return (
		<>
			<Container
				data-ui="ListingHero"
				data-ui-position="relative"
				data-ui-height="content"
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			>
				<HeroImage
					src={hero}
					alt={`Hero image for listing ${listing.id}`}
					className={"h-42"}
				/>

				{/* <ListingPrice
					price={listing.price}
					priceType={listing.priceType}
					currency={listing.currency}
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-snap-to="top-center"
				/> */}

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
					{/* <Typo
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
					/> */}
				</Container>
			</Container>

			<ListingSheet
				_suspense={"I know"}
				listing={listing}
				state={{
					value: isOpen,
					set: setIsOpen,
				}}
			/>
		</>
	);
};
