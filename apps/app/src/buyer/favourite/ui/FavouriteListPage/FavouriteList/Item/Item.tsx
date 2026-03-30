import { withFallback } from "@use-pico/client/utils";
import { toTimeDiff } from "@use-pico/common/time";

import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
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
}, SpinnerContainer);
