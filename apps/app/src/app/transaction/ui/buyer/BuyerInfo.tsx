import { useLocale } from "@use-pico/client/hook";
import { Icon } from "@use-pico/client/icon";
import { Container, LabelValue, SpinnerContainer } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { toTimeDiff } from "@use-pico/common/time";
import { translator } from "@use-pico/common/translator";
import { withTransactionBuyerInfoQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { RatingToIcon } from "@zbav-se.me/ui/rating";
import { DateTime } from "luxon";
import type { FC } from "react";
import { toBuyerScoreHint } from "~/app/transaction/ui/buyer/toBuyerScoreHint";

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
								flow: "vertical",
								inner: "default",
								gap: "default",
							}}
							className={"px-0"}
						>
							<LabelValue
								textLabel={"Reaction rate (label)"}
								textHint={translator.text("Reaction rate (hint)")}
								textValue={percentLabel(events.reaction.percent)}
							/>

							<LabelValue
								textLabel={"Reaction p90 (label)"}
								textHint={translator.text("Reaction p90 (hint)")}
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
						</Container>

						<Container
							ui={{
								flow: "vertical",
								inner: "default",
								gap: "default",
							}}
							className={"px-0"}
						>
							<LabelValue
								textLabel={"Closer rate (label)"}
								textHint={translator.text("Closer rate (hint)")}
								textValue={percentLabel(events.closer.percent)}
							/>

							<LabelValue
								textLabel={"Closer p90 (label)"}
								textHint={translator.text("Closer p90 (hint)")}
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
						</Container>

						<LabelValue
							textLabel={"Decision rate (label)"}
							textHint={translator.text("Decision rate (hint)")}
							textValue={percentLabel(events.decision.percent)}
						/>

						<LabelValue
							textLabel={"Expired rate (label)"}
							textHint={translator.text("Expired rate (hint)")}
							textValue={percentLabel(events.expired.percent)}
						/>

						<Container
							ui={{
								flow: "vertical",
								inner: "default",
								gap: "default",
							}}
							className={"px-0"}
						>
							<LabelValue
								textLabel={"Buyer load (label)"}
								textHint={translator.text("Buyer load (hint)")}
								textValue={translator.text(`Buyer load ${events.load.bucket}`)}
							/>

							<LabelValue
								textLabel={"Buyer activity (label)"}
								textHint={translator.text("Buyer activity (hint)")}
								textValue={translator.text(
									`Buyer activity ${events.activity.bucket}`,
								)}
							/>
						</Container>

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
										icon={RatingToIcon[events.score.rank as RatingToIcon.Value]}
										ui={{
											text: "2xl",
										}}
									/>

									<Tx
										label={toBuyerScoreHint(events.score.rank)}
										ui={{
											wrap: "wrap",
										}}
									/>
								</Container>
							}
						/>
					</Container>
				);
			}}
		</withTransactionBuyerInfoQuery.Suspense>
	);
};
