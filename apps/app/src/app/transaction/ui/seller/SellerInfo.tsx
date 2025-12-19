import { useLocale } from "@use-pico/client/hook";
import { Container, LabelValue, SpinnerContainer } from "@use-pico/client/ui/container";
import { toTimeDiff } from "@use-pico/common/time";
import { withTransactionSellerInfoQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace SellerInfo {
	export interface Props extends Container.Props {
		transactionId: string;
	}
}

export const SellerInfo: FC<SellerInfo.Props> = ({ transactionId, ui, ...props }) => {
	const locale = useLocale();

	return (
		<withTransactionSellerInfoQuery.Suspense
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
		</withTransactionSellerInfoQuery.Suspense>
	);
};
