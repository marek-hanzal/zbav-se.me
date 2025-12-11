import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withTransactionSellerInfoQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace SellerInfoContainer {
	export interface Props extends Container.Props {
		locale: string;
		transactionId: string;
	}
}

export const SellerInfoContainer: FC<SellerInfoContainer.Props> = ({
	locale,
	transactionId,
	ui,
	...props
}) => {
	return (
		<Container
			data-ui={"SellerInfoContainer"}
			ui={{
				layout: "vertical-flex",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<withTransactionSellerInfoQuery.Suspense
				data={{
					where: {
						id: transactionId,
					},
					meta: {
						side: "buyer",
					},
				}}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					return (
						<>
							<BadgeValue
								textLabel={"Seller - account age (label)"}
								textValue={toTimeDiff({
									locale,
									time: data.registered,
									type: "human",
								})}
							/>

							<BadgeValue
								textLabel={"Seller - score (label)"}
								textValue={toLocaleNumber({
									locale,
									number: data.score,
								})}
							/>
						</>
					);
				}}
			</withTransactionSellerInfoQuery.Suspense>
		</Container>
	);
};
