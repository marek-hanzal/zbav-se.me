import { Container, LabelValue } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { RatingIcon } from "~/common/score/ui/RatingIcon";

export namespace Score {
	export interface Props {
		rank: number;
	}
}

export const Score: FC<Score.Props> = ({ rank }) => {
	return (
		<LabelValue
			textLabel={translator.text("User score (label)")}
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
					<RatingIcon rating={rank} />

					<Tx
						label={translator.text(`Buyer score ${rank}`)}
						ui={{
							wrap: "wrap",
						}}
					/>
				</Container>
			}
		/>
	);
};
