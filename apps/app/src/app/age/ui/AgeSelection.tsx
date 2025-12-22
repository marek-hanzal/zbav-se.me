import { Tx } from "@use-pico/client/ui/tx";
import { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace AgeSelection {
	export interface Props extends Rating.Props {
		//
	}
}

export const AgeSelection: FC<AgeSelection.Props> = ({ ...props }) => {
	return (
		<Rating
			data-ui="AgeSelection[Rating]"
			renderPrefix={() => (
				<Tx
					label="Age - from youngest (label)"
					ui={{
						color: "icon",
					}}
					className={"text-center"}
				/>
			)}
			renderSuffix={() => (
				<Tx
					label="Age - from oldest (label)"
					ui={{
						color: "icon",
					}}
					className={"text-center"}
				/>
			)}
			{...props}
		/>
	);
};
