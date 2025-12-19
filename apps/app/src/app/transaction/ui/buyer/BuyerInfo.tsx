import { useLocale } from "@use-pico/client/hook";
import { Container, LabelValue, SpinnerContainer } from "@use-pico/client/ui/container";
import { toTimeDiff } from "@use-pico/common/time";
import { withTransactionBuyerInfoQuery } from "@zbav-se.me/sdk/query/user/transaction";
import type { FC } from "react";

export namespace BuyerInfo {
	export interface Props extends Container.Props {
		transactionId: string;
	}
}

export const BuyerInfo: FC<BuyerInfo.Props> = ({ transactionId, ui, ...props }) => {
	const locale = useLocale();

	return (
		<withTransactionBuyerInfoQuery.Suspense
			data={{
				where: {
					id: transactionId,
				},
			}}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
				return (
					<Container
						ui={{
							flow: "vertical",
							gap: "default",
							...ui,
						}}
						{...props}
					>
						<LabelValue
							textLabel={"User registered (label)"}
							textValue={toTimeDiff({
								locale,
								time: data.registered,
								type: "relative",
							})}
						/>

						<LabelValue
							textLabel={"User score (label)"}
							textValue={data.score}
						/>
					</Container>
				);
			}}
		</withTransactionBuyerInfoQuery.Suspense>
	);
};
