import { useLocale } from "@use-pico/client/hook";
import { Icon } from "@use-pico/client/icon";
import { Container, LabelValue, SpinnerContainer } from "@use-pico/client/ui/container";
import { toTimeDiff } from "@use-pico/common/time";
import { withTransactionBuyerInfoQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { RatingToIcon } from "@zbav-se.me/ui/rating";
import { DateTime } from "luxon";
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

						<Container
							ui={{
								inner: "default",
							}}
							className={"px-0"}
						>
							<LabelValue
								textLabel={"Reaction p90 (label)"}
								textHint={"Reaction p90 (hint)"}
								textValue={toTimeDiff({
									locale,
									time: DateTime.now()
										.minus({
											milliseconds: events.reaction.p90Ms,
										})
										.toISO(),
									type: "human",
								})}
							/>

							<LabelValue
								textLabel={"Reaction rate (label)"}
								textHint={"Reaction rate (hint)"}
								textValue={percentLabel(events.reaction.percent)}
							/>
						</Container>

						<Container
							ui={{
								inner: "default",
							}}
							className={"px-0"}
						>
							<LabelValue
								textLabel={"Closer p90 (label)"}
								textHint={"Closer p90 (hint)"}
								textValue={toTimeDiff({
									locale,
									time: DateTime.now()
										.minus({
											milliseconds: events.closer.p90Ms,
										})
										.toISO(),
									type: "human",
								})}
							/>

							<LabelValue
								textLabel={"Closer rate (label)"}
								textHint={"Closer rate (hint)"}
								textValue={percentLabel(events.closer.percent)}
							/>
						</Container>

						<LabelValue
							textLabel={"Decision rate (label)"}
							textHint={"Decision rate (hint)"}
							textValue={percentLabel(events.decision.percent)}
						/>

						<LabelValue
							textLabel={"Expired rate (label)"}
							textHint={"Expired rate (hint)"}
							textValue={percentLabel(events.expired.percent)}
						/>

						<Container
							ui={{
								inner: "default",
							}}
							className={"px-0"}
						>
							<LabelValue
								textLabel={"Buyer load (label)"}
								textHint={"Buyer load (hint)"}
								textValue={events.load.bucket}
							/>

							<LabelValue
								textLabel={"Buyer activity (label)"}
								textHint={"Buyer activity (hint)"}
								textValue={events.activity.bucket}
							/>
						</Container>

						<LabelValue
							textLabel={"User score (label)"}
							textHint={"User score (hint)"}
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
