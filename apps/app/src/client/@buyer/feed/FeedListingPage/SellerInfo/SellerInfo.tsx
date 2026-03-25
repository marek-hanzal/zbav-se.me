import { Icon, ShowIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { LabelValue } from "@use-pico/client/ui/container";
import { withFallback } from "@use-pico/client/utils";
import { translator } from "@use-pico/common/translator";
import { withListingSellerInfoQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { RatingIcon } from "~/client/@common/score/ui/RatingIcon";

export namespace SellerInfo {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
		onView(view: "seller-info"): void;
	}
}

export const SellerInfo = withFallback(
	({ _suspense, listingId, onView }: SellerInfo.Props) => {
		const { data: sellerInfo } = withListingSellerInfoQuery.useSuspenseQuery({
			listingId,
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
