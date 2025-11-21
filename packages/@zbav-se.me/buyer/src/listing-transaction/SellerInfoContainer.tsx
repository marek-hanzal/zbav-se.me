import type { MarkSuspense } from "@use-pico/client/type";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withListingTransactionSellerInfoQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace SellerInfoContainer {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		listingTransactionId: string;
	}
}

export const SellerInfoContainer: FC<SellerInfoContainer.Props> = ({
	_suspense,
	locale,
	listingTransactionId,
	...props
}) => {
	const sellerInfoQuery = withListingTransactionSellerInfoQuery.useSuspenseQuery({
		where: {
			id: listingTransactionId,
		},
		meta: {
			side: "buyer",
		},
	});

	return (
		<Container
			ui={"SellerInfoContainer-root"}
			layout={"vertical-flex"}
			gap={"sm"}
			height={"content"}
			{...props}
		>
			<BadgeValue
				textLabel={"Seller - account age (label)"}
				textValue={toTimeDiff({
					locale,
					time: sellerInfoQuery.data.registered,
					type: "human",
				})}
			/>

			<BadgeValue
				textLabel={"Seller - score (label)"}
				textValue={toLocaleNumber({
					locale,
					number: sellerInfoQuery.data.score,
				})}
			/>
		</Container>
	);
};
