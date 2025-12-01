import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { VariantProvider } from "@use-pico/cls";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withListingTransactionSellerInfoQuery } from "@zbav-se.me/sdk/query/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC } from "react";

export namespace SellerInfoContainer {
	export interface Props extends Container.Props {
		locale: string;
		listingTransactionId: string;
	}
}

export const SellerInfoContainer: FC<SellerInfoContainer.Props> = ({
	locale,
	listingTransactionId,
	...props
}) => {
	return (
		<Container
			ui={"SellerInfoContainer-root"}
			layout={"vertical-flex"}
			gap={"sm"}
			height={"content"}
			tone={"unset"}
			theme={"unset"}
			{...props}
		>
			<withListingTransactionSellerInfoQuery.Suspense
				data={{
					where: {
						id: listingTransactionId,
					},
					meta: {
						side: "buyer",
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
						</VariantProvider>
					);
				}}
			</withListingTransactionSellerInfoQuery.Suspense>
		</Container>
	);
};
