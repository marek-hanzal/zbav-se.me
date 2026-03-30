import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Tx } from "@/lib/client/tx";
import { LabelValue } from "@/lib/client/value";
import { translator } from "@/lib/common/translator";
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
						label={translator.text(`Seller score ${rank}`)}
						ui={{
							wrap: "wrap",
						}}
					/>
				</Container>
			}
		/>
	);
};
