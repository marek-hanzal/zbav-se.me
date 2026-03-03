import { Icon, ShowIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { withListingSellerInfoQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import type { FC } from "react";
import { RatingIcon } from "~/app/@common/score/ui/RatingIcon";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
		onView(view: "seller-info"): void;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, listingId, onView }) => {
	const { data: sellerInfo } = withListingSellerInfoQuery.useSuspenseQuery({
		listingId,
	});

	return (
		<LabelValue
			textLabel={translator.text("Listing seller hint (label)")}
			textValue={
				sellerInfo.events ? <RatingIcon rating={sellerInfo.events.score.rank} /> : null
			}
			textEmpty={translator.text("Listing seller info not available (empty)")}
			action={<Icon icon={ShowIcon} />}
			onClick={() => onView("seller-info")}
		/>
	);
};
