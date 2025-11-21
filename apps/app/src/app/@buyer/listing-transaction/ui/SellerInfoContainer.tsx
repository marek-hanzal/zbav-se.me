import { useParams } from "@tanstack/react-router";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withListingTransactionSellerInfoQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace SellerInfoContainer {
	export interface Props extends Container.Props {
		listingTransactionId: string;
	}
}

export const SellerInfoContainer: FC<SellerInfoContainer.Props> = ({
	listingTransactionId,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});
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
