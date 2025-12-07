import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { VariantProvider } from "@use-pico/cls";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withListingTransactionBuyerInfoQuery } from "@zbav-se.me/sdk/query/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC } from "react";

export namespace BuyerInfoContainer {
	export interface Props extends Container.Props {
		locale: string;
		listingTransactionId: string;
	}
}

export const BuyerInfoContainer: FC<BuyerInfoContainer.Props> = ({
	locale,
	listingTransactionId,
	...props
}) => {
	return (
		<Container
			data-ui={"BuyerInfoContainer-root"}
			layout={"vertical-flex"}
			gap={"sm"}
			{...props}
		>
			<withListingTransactionBuyerInfoQuery.Suspense
				data={{
					where: {
						id: listingTransactionId,
					},
					meta: {
						side: "seller",
					},
				}}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					return (
						<VariantProvider
							cls={ThemeCls}
							variant={{
								tone: "primary",
								theme: "light",
							}}
						>
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
						</VariantProvider>
					);
				}}
			</withListingTransactionBuyerInfoQuery.Suspense>
		</Container>
	);
};
