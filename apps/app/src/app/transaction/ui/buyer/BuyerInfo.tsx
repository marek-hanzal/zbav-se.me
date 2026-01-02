import { useLocale } from "@use-pico/client/hook";
import { Icon } from "@use-pico/client/icon";
import { Container, LabelValue, SpinnerContainer } from "@use-pico/client/ui/container";
import { msToRelative, toTimeDiff } from "@use-pico/common/time";
import { withTransactionBuyerInfoQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { RatingToIcon } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

const percentLabel = (value: number) => `${Math.round(value)}%`;

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
				const events = data.events;

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
							textLabel={"Reaction rate (label)"}
							textValue={percentLabel(events.reaction.percent)}
						/>

						<LabelValue
							textLabel={"Reaction p90 (label)"}
							textValue={msToRelative({
								locale,
								ms: events.reaction.p90Ms,
							})}
						/>

						<LabelValue
							textLabel={"Closer rate (label)"}
							textValue={percentLabel(events.closer.percent)}
						/>

						<LabelValue
							textLabel={"Closer p90 (label)"}
							textValue={msToRelative({
								locale,
								ms: events.closer.p90Ms,
							})}
						/>

						<LabelValue
							textLabel={"Decision rate (label)"}
							textValue={percentLabel(events.decision.percent)}
						/>

						<LabelValue
							textLabel={"Expired rate (label)"}
							textValue={percentLabel(events.expired.percent)}
						/>

						<LabelValue
							textLabel={"Buyer load (label)"}
							textValue={events.load.bucket}
						/>

						<LabelValue
							textLabel={"Buyer activity (label)"}
							textValue={events.activity.bucket}
						/>

						<LabelValue
							textLabel={"User score (label)"}
							textValue={
								<Icon
									icon={RatingToIcon[events.score.rank as RatingToIcon.Value]}
									ui={{
										text: "2xl",
									}}
								/>
							}
						/>
					</Container>
				);
			}}
		</withTransactionBuyerInfoQuery.Suspense>
	);
};
