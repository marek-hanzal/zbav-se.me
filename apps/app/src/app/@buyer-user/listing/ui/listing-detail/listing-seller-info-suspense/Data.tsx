import { Icon, ShowIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { withListingSellerInfoQuery } from "@zbav-se.me/sdk/query/buyer-session/listing";
import type { FC } from "react";
import { ScoreIcon } from "~/app/@common/score/ui/ScoreIcon";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
		onSellerInfo(): void;
	}
}

export const Data: FC<Data.Props> = ({
	_suspense,
	listingId,
	onSellerInfo,
}) => {
	const { data: sellerInfo } = withListingSellerInfoQuery.useSuspenseQuery({
		listingId,
	});

	return (
		<LabelValue
			textLabel={translator.text("Listing seller hint (label)")}
			textValue={
				sellerInfo.events ? <ScoreIcon score={sellerInfo.events.score.rank} /> : null
			}
			textEmpty={translator.text("Listing seller info not available (empty)")}
			action={<Icon icon={ShowIcon} />}
			onClick={onSellerInfo}
		/>
	);
};
