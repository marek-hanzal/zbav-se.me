import { Icon } from "@use-pico/client/icon";
import { Container, LabelValue } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { RatingToIcon } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { toSellerScoreHint } from "./toSellerScoreHint";

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
					<Icon
						icon={RatingToIcon[rank as RatingToIcon.Value]}
						ui={{
							text: "2xl",
						}}
					/>

					<Tx
						label={toSellerScoreHint(rank)}
						ui={{
							wrap: "wrap",
						}}
					/>
				</Container>
			}
		/>
	);
};
