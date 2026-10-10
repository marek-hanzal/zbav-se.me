import type { FC } from "react";
import { RatingIcon } from "~/common/score/ui/RatingIcon";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { LabelValue } from "~/ui/ui/LabelValue";

export namespace Score {
	export interface Props {
		rank: number;
	}
}

export const Score: FC<Score.Props> = ({ rank }) => {
	const translator = useTranslator();
	return (
		<LabelValue
			textLabel={translator.text("User score (label)")}
			textHint={translator.text("User score (hint)")}
			textValue={
				<Container
					data-ui-flow="horizontal"
					data-ui-items="center"
					data-ui-justify="space-between"
					data-ui-gap="default"
				>
					<RatingIcon rating={rank} />

					<Tx
						label={translator.text(`Buyer score ${rank}`)}
						data-ui-wrap="wrap"
					/>
				</Container>
			}
		/>
	);
};
