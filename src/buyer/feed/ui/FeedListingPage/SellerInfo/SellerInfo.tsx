import { withFallback } from "@/lib/client/fallback";
import { Icon, ShowIcon } from "@/lib/client/icon";
import type { MarkSuspense } from "@/lib/client/type";
import { LabelValue } from "@/lib/client/value";
import { translator } from "@/lib/common/translation";
import { withListingSellerInfoQuery } from "~/buyer/listing/query/withListingSellerInfoQuery";
import { RatingIcon } from "~/common/score/ui/RatingIcon";

export namespace SellerInfo {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
		onView(view: "seller-info"): void;
	}
}

export const SellerInfo = withFallback(
	({ _suspense, listingId, onView }: SellerInfo.Props) => {
		const { data: sellerInfo } = withListingSellerInfoQuery.useSuspenseQuery({
			id: listingId,
		});

		return (
			<LabelValue
				data-ui={"SellerInfo"}
				data-action={"open seller info"}
				textLabel={translator.text("Listing seller hint (label)")}
				textValue={
					sellerInfo.events ? <RatingIcon rating={sellerInfo.events.score.rank} /> : null
				}
				textEmpty={translator.text("Listing seller info not available (empty)")}
				action={<Icon icon={ShowIcon} />}
				onClick={() => onView("seller-info")}
			/>
		);
	},
	(props: Omit<SellerInfo.Props, "_suspense">) => {
		return (
			<LabelValue
				textLabel={translator.text("Listing seller hint (label)")}
				textValue={null}
				action={<Icon icon={ShowIcon} />}
				{...props}
			/>
		);
	},
);
