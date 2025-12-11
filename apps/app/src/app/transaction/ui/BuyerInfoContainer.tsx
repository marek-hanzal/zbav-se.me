import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withTransactionBuyerInfoQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace BuyerInfoContainer {
	export interface Props extends Container.Props {
		locale: string;
		transactionId: string;
	}
}

export const BuyerInfoContainer: FC<BuyerInfoContainer.Props> = ({
	locale,
	transactionId,
	ui,
	...props
}) => {
	return (
		<Container
			data-ui={"BuyerInfoContainer"}
			ui={{
				layout: "vertical-flex",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<withTransactionBuyerInfoQuery.Suspense
				data={{
					where: {
						id: transactionId,
					},
					meta: {
						side: "seller",
					},
				}}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					return (
						<>
							<BadgeValue
								textLabel={"Buyer - account age (label)"}
								textValue={toTimeDiff({
									locale,
									time: data.registered,
									type: "human",
								})}
							/>

							<BadgeValue
								textLabel={"Buyer - score (label)"}
								textValue={toLocaleNumber({
									locale,
									number: data.score,
								})}
							/>
						</>
					);
				}}
			</withTransactionBuyerInfoQuery.Suspense>
		</Container>
	);
};
