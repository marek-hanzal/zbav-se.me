import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { ListItem } from "~/common/list-item/ListItem";

export namespace Item {
	export interface Props {
		listing: ListingSchema.Type;
	}
}

export const Item: FC<Item.Props> = ({ listing }) => {
	const locale = useLocale();
	const [hero] = listing.withImageUrl;

	return (
		<ListItem
			data-ui={"Item"}
			data-action={"open listing detail"}
			hero={hero}
			title={
				<Typo
					label={listing.title}
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-color="lead"
					data-ui-font="semibold"
					data-ui-text="sm"
					data-ui-display="block"
					data-ui-width="full"
					data-ui-truncate
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
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-text="xs"
					data-ui-font="normal"
					data-ui-color="text"
					data-ui-opacity="5"
				/>
			}
		/>
	);
};
