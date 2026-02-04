import { useLocale } from "@use-pico/client/hook";
import { Icon } from "@use-pico/client/icon";
import { Container, LabelValue, SpinnerContainer } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { translator } from "@use-pico/common/translator";
import { withListingSellerInfoQuery } from "@zbav-se.me/sdk/query/buyer-session/listing";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import { RatingToIcon } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { toSellerScoreHint } from "~/app/transaction/ui/seller/toSellerScoreHint";

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
							height: "full",
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
							textLabel={"Seller - listings (label)"}
							textValue={toLocaleNumber({
								locale,
								number: data.listings,
							})}
						/>

						{data.events ? (
							<LabelValue
								textLabel={"User score (label)"}
								textHint={translator.text("User score (hint)")}
								textValue={
									<Container
										ui={{
											flow: "horizontal",
											items: "center",
											justify: "space-between",
											gap: "default",
										}}
									>
										<Icon
											icon={
												RatingToIcon[
													data.events.score.rank as RatingToIcon.Value
												]
											}
											ui={{
												text: "2xl",
											}}
										/>

										<Tx
											label={toSellerScoreHint(data.events.score.rank)}
											ui={{
												wrap: "wrap",
											}}
										/>
									</Container>
								}
							/>
						) : (
							<Status
								icon={SearchIcon}
								textTitle={translator.text(
									"Listing seller info not available (title)",
								)}
								textMessage={translator.text(
									"Listing seller info not available (message)",
								)}
								ui={{
									tone: "brand",
									theme: "light",
									inner: "2xl",
									opacity: "medium",
								}}
								className={"text-center"}
							/>
						)}
					</Container>
				);
			}}
		</withListingSellerInfoQuery.Suspense>
	);
};
