import { type useSnapperNav as SnapperNavType } from "@use-pico/client";
import { toHumanNumber } from "@use-pico/common";
import { type FC, memo } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { Dial } from "~/app/ui/dial/Dial";

export namespace PriceWrapper {
	export interface Props {
		listingNav: SnapperNavType.Result;
		locale: string;
	}
}

export const PriceWrapper: FC<PriceWrapper.Props> = memo(
	({ listingNav, locale }) => {
		const useCreateListingStore = useCreateListingContext();
		const price = useCreateListingStore((store) => store.price);
		const setPrice = useCreateListingStore((store) => store.setPrice);
		const hasPrice = useCreateListingStore((store) => store.hasPrice);

		return (
			<ListingContainer
				listingNavApi={listingNav.api}
				textTitle={"Price (title)"}
				textSubtitle={
					hasPrice
						? toHumanNumber({
								number: price,
								locale,
							})
						: "Price (subtitle)"
				}
				bottom={{
					next: hasPrice,
				}}
			>
				<Dial
					locale={locale}
					value={price}
					onChange={setPrice}
				/>
			</ListingContainer>
		);
	},
);
