import { useParams } from "@tanstack/react-router";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withListingTransactionBuyerInfoQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace BuyerInfoContainer {
	export interface Props extends Container.Props {
		listingTransactionId: string;
	}
}

export const BuyerInfoContainer: FC<BuyerInfoContainer.Props> = ({
	listingTransactionId,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const buyerInfoQuery = withListingTransactionBuyerInfoQuery.useSuspenseQuery({
		where: {
			id: listingTransactionId,
		},
		meta: {
			side: "seller",
		},
	});

	return (
		<Container
			ui={"BuyerInfoContainer-root"}
			layout={"vertical-flex"}
			gap={"sm"}
			{...props}
		>
			<BadgeValue
				textLabel={"Buyer - account age (label)"}
				textValue={toTimeDiff({
					locale,
					time: buyerInfoQuery.data.registered,
					type: "human",
				})}
			/>

			<BadgeValue
				textLabel={"Buyer - score (label)"}
				textValue={toLocaleNumber({
					locale,
					number: buyerInfoQuery.data.score,
				})}
			/>
		</Container>
	);
};
