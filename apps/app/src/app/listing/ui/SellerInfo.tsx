import { useLocale } from "@use-pico/client/hook";
import { Container, LabelValue, SpinnerContainer } from "@use-pico/client/ui/container";
import { toTimeDiff } from "@use-pico/common/time";
import { withListingSellerInfoQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace SellerInfo {
	export interface Props extends Container.Props {
		listingId: string;
	}
}

export const SellerInfo: FC<SellerInfo.Props> = ({ listingId, ui, ...props }) => {
	const locale = useLocale();

	return (
		<withListingSellerInfoQuery.Suspense
			data={{
				listingId,
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
		</withListingSellerInfoQuery.Suspense>
	);
};
