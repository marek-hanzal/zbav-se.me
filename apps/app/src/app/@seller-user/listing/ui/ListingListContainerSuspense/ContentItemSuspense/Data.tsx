import { withListingQuery } from "@zbav-se.me/sdk/query/seller-user/listing";
import type { FC } from "react";
import { Hero } from "~/app/@seller-user/listing/ui/Hero";

export namespace Data {
	export interface Props {
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({ listingId }) => {
	const listingQuery = withListingQuery.useQuery(listingId);

	return (
		<Hero
			data-ui={"MyListing-[Hero]"}
			listing={listingQuery.data}
			heroImageProps={{
				ui: {
					round: "default",
				},
			}}
		/>
	);
};
