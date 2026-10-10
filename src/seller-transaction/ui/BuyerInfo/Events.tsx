import { DateTime } from "luxon";
import type { FC } from "react";
import { toTimeDiffFn } from "~/date/fn/toTimeDiffFn";
import { useLocale } from "~/locale/hook/useLocale";
import type { UserEventBuyerSchema } from "~/seller-user-event/schema/UserEventBuyerSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Container } from "~/ui/ui/Container";
import { LabelValue } from "~/ui/ui/LabelValue";

const percentLabelFn = (value: number) => `${Math.round(value)}%`;

export namespace Events {
	export interface Props {
		events: UserEventBuyerSchema.Type;
	}
}

export const Events: FC<Events.Props> = ({ events }) => {
	const translator = useTranslator();
	const locale = useLocale();

	return (
		<>
			<Container
				data-ui-flow="vertical"
				data-ui-inner="default"
				data-ui-gap="default"
				className={"px-0"}
			>
				<LabelValue
					textLabel={translator.textFn("Reaction rate (label)")}
					textHint={translator.textFn("Reaction rate (hint)")}
					textValue={percentLabelFn(events.reaction.percent)}
				/>

				<LabelValue
					textLabel={translator.textFn("Reaction p90 (label)")}
					textHint={translator.textFn("Reaction p90 (hint)")}
					textValue={toTimeDiffFn({
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
				data-ui-flow="vertical"
				data-ui-inner="default"
				data-ui-gap="default"
				className={"px-0"}
			>
				<LabelValue
					textLabel={translator.textFn("Closer rate (label)")}
					textHint={translator.textFn("Closer rate (hint)")}
					textValue={percentLabelFn(events.closer.percent)}
				/>

				<LabelValue
					textLabel={translator.textFn("Closer p90 (label)")}
					textHint={translator.textFn("Closer p90 (hint)")}
					textValue={toTimeDiffFn({
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
				textLabel={translator.textFn("Decision rate (label)")}
				textHint={translator.textFn("Decision rate (hint)")}
				textValue={percentLabelFn(events.decision.percent)}
			/>

			<LabelValue
				textLabel={translator.textFn("Expired rate (label)")}
				textHint={translator.textFn("Expired rate (hint)")}
				textValue={percentLabelFn(events.expired.percent)}
			/>

			<Container
				data-ui-flow="vertical"
				data-ui-inner="default"
				data-ui-gap="default"
				className={"px-0"}
			>
				<LabelValue
					textLabel={translator.textFn("Buyer load (label)")}
					textHint={translator.textFn("Buyer load (hint)")}
					textValue={translator.textFn(`Buyer load ${events.load.bucket}`)}
				/>

				<LabelValue
					textLabel={translator.textFn("Buyer activity (label)")}
					textHint={translator.textFn("Buyer activity (hint)")}
					textValue={translator.textFn(`Buyer activity ${events.activity.bucket}`)}
				/>
			</Container>
		</>
	);
};
