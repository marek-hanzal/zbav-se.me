import { Typo } from "@use-pico/client/ui/typo";
import { withListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
import type { FC } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListItem } from "~/app/@common/list-item/ListItem";

export namespace Data {
	export interface Props {
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({ listingId }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const hero = useUpload(listing.gallery.items);

	return (
		<ListItem
			hero={hero}
			title={
				<Typo
					label={listing.title ?? "Draft (label)"}
					ui={{
						tone: "neutral",
						theme: "light",
						color: "lead",
						font: "semibold",
						text: "sm",
						display: "block",
						width: "full",
						truncate: true,
					}}
					className={[
						"block",
						"w-full",
						"max-w-full",
						"min-w-0",
					]}
				/>
			}
			bottom={undefined}
		/>
	);
};
