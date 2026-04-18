import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListItem } from "~/common/list-item/ListItem";

export namespace Item {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
	}
}

export const Item = withFallback(({ _suspense, listingId }: Item.Props) => {
	const locale = useLocale();
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const hero = useUpload(listing.gallery.items);

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
}, SpinnerContainer);
