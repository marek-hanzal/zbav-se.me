import { useLocale } from "@use-pico/client/hook";
import { ChevronLeftIcon, type ChevronRightIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import type { StateType } from "@use-pico/common/type";
import type { FC } from "react";
import { FeedSetupButton } from "./FeedSetupButton";

export namespace FeedStatusAction {
	export interface Props {
		state: StateType.Simple<boolean>;
		backIcon: typeof ChevronLeftIcon | typeof ChevronRightIcon;
	}
}

export const FeedStatusAction: FC<FeedStatusAction.Props> = ({ state, backIcon }) => {
	const locale = useLocale();

	return (
		<>
			<FeedSetupButton
				state={state}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				ui={{
					tone: "secondary",
					theme: "light",
					snapTo: undefined,
					justify: "center",
					round: "default",
					text: "default",
					size: "default",
					width: "full",
					font: "semibold",
					square: undefined,
				}}
			/>

			<LinkTo
				icon={backIcon}
				iconPosition={backIcon === ChevronLeftIcon ? "left" : "right"}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				to={"/$locale/home"}
				params={{
					locale,
				}}
				{...uiButton({
					ui: {
						tone: "link",
						theme: "light",
						text: "default",
						size: "default",
						justify: "center",
						width: "full",
						background: undefined,
						border: false,
						shadow: false,
					},
					className: [],
				})}
			>
				<Tx label="Back to home (link)" />
			</LinkTo>
		</>
	);
};
