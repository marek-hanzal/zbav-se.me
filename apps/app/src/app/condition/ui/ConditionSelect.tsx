import { Tx } from "@use-pico/client/ui/tx";
import { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";

export namespace ConditionSelect {
	export interface Props extends Rating.Props {
		//
	}
}

export const ConditionSelect: FC<ConditionSelect.Props> = ({ ...props }) => {
	return (
		<Rating
			data-ui="ConditionSelect[Rating]"
			renderPrefix={() => (
				<Tx
					label="Condition - from best (label)"
					ui={{
						color: "icon",
					}}
					className={"text-center"}
				/>
			)}
			renderSuffix={() => (
				<Tx
					label="Condition - from worst (label)"
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
