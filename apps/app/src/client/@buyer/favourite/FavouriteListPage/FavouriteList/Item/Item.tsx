import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { withFallback } from "@use-pico/client/utils";
import { toTimeDiff } from "@use-pico/common/time";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { useUpload } from "~/client/@common/gallery/hook/useUpload";
import { ListItem } from "~/client/@common/list-item/ListItem";

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
