import { useLocale } from "@use-pico/client/hook";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import type { FC } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListItem } from "~/app/@common/list-item/ListItem";

export namespace Data {
	export interface Props {
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({ listingId }) => {
	const locale = useLocale();
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const hero = useUpload(listing.gallery.items);

	return (
		<ListItem
			hero={hero}
			title={
				<Typo
					label={listing.title}
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
			bottom={
				<Typo
					label={toTimeDiff({
						locale,
						time: listing.updatedAt,
					})}
					ui={{
						tone: "neutral",
						theme: "light",
						text: "xs",
						font: "normal",
						color: "text",
						opacity: "5",
					}}
				/>
			}
		/>
	);
};
