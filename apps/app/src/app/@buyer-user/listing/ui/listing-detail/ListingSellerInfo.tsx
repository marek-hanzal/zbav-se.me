import { Icon, ShowIcon } from "@use-pico/client/icon";
import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { withListingSellerInfoQuery } from "@zbav-se.me/sdk/query/buyer-session/listing";
import type { FC } from "react";
import { ScoreIcon } from "~/app/@common/score/ui/ScoreIcon";

export namespace ListingSellerInfo {
	export interface Props {
		listingId: string;
		onSellerInfo(): void;
	}
}

export const ListingSellerInfo: FC<ListingSellerInfo.Props> = ({ listingId, onSellerInfo }) => {
	return (
		<withListingSellerInfoQuery.Suspense
			data={{
				listingId,
			}}
			fallback={
				<LabelValue
					textLabel={translator.text("Listing seller hint (label)")}
					textValue={null}
					action={<Icon icon={ShowIcon} />}
					onClick={onSellerInfo}
				/>
			}
		>
			{({ data: sellerInfo }) => {
				return (
					<LabelValue
						textLabel={translator.text("Listing seller hint (label)")}
						textValue={
							sellerInfo.events ? (
								<ScoreIcon score={sellerInfo.events.score.rank} />
							) : null
						}
						textEmpty={translator.text("Listing seller info not available (empty)")}
						action={<Icon icon={ShowIcon} />}
						onClick={onSellerInfo}
					/>
				);
			}}
		</withListingSellerInfoQuery.Suspense>
	);
};
