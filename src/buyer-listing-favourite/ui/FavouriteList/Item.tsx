import type { FC } from "react";
import type { ListingSchema } from "~/buyer-listing/schema/ListingSchema";
import { toTimeDiff } from "~/date/fn/toTimeDiff";
import { ListItem } from "~/list-item/ui/ListItem";
import { useLocale } from "~/locale/hook/useLocale";
import { Typo } from "~/ui/ui/Typo";

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
			data-ui={"Item[ListItem]"}
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
