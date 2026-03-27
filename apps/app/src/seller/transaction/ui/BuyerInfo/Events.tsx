import { useLocale } from "@use-pico/client/hook";
import { Container, LabelValue } from "@use-pico/client/ui/container";
import { toTimeDiff } from "@use-pico/common/time";
import { translator } from "@use-pico/common/translator";
import { DateTime } from "luxon";
import type { FC } from "react";
import type { UserEventBuyerSchema } from "~/seller/user-event/server/schema/UserEventBuyerSchema";

const percentLabel = (value: number) => `${Math.round(value)}%`;

export namespace Events {
	export interface Props {
		events: UserEventBuyerSchema.Type;
	}
}

export const Events: FC<Events.Props> = ({ events }) => {
	const locale = useLocale();

	return (
		<>
			<Container
				ui={{
					flow: "vertical",
					inner: "default",
					gap: "default",
				}}
				className={"px-0"}
			>
				<LabelValue
					textLabel={translator.text("Reaction rate (label)")}
					textHint={translator.text("Reaction rate (hint)")}
					textValue={percentLabel(events.reaction.percent)}
				/>

				<LabelValue
					textLabel={translator.text("Reaction p90 (label)")}
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
					textLabel={translator.text("Closer rate (label)")}
					textHint={translator.text("Closer rate (hint)")}
					textValue={percentLabel(events.closer.percent)}
				/>

				<LabelValue
					textLabel={translator.text("Closer p90 (label)")}
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
				textLabel={translator.text("Decision rate (label)")}
				textHint={translator.text("Decision rate (hint)")}
				textValue={percentLabel(events.decision.percent)}
			/>

			<LabelValue
				textLabel={translator.text("Expired rate (label)")}
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
					textLabel={translator.text("Buyer load (label)")}
					textHint={translator.text("Buyer load (hint)")}
					textValue={translator.text(`Buyer load ${events.load.bucket}`)}
				/>

				<LabelValue
					textLabel={translator.text("Buyer activity (label)")}
					textHint={translator.text("Buyer activity (hint)")}
					textValue={translator.text(`Buyer activity ${events.activity.bucket}`)}
				/>
			</Container>
		</>
	);
};
