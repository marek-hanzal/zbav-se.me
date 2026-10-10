import type { FC } from "react";
import { useLocale } from "~/locale/hook/useLocale";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { uiButtonFn } from "~/ui/fn/uiButtonFn";
import type { uiLinkToFn } from "~/ui/fn/uiLinkToFn";
import { LinkTo } from "~/ui/ui/LinkTo";

export namespace ContinueSessionButton {
	export interface Props
		extends uiLinkToFn.Component<Pick<LinkTo.Props, "iconProps" | "ref" | "id" | "onKeyDown">> {
		//
	}
}

export const ContinueSessionButton: FC<ContinueSessionButton.Props> = ({ ...props }) => {
	const locale = useLocale();

	return (
		<LinkTo
			data-action={"continue agent session"}
			icon={ArrowRightIcon}
			iconProps={{
				"data-ui-text": "lg",
			}}
			to="/$locale/app/agent/continue"
			params={{
				locale,
			}}
			{...uiButtonFn({
				"data-ui-items": "center",
				"data-ui-justify": "center",
				"data-ui-tone": "neutral",
				"data-ui-theme": "light",
				"data-ui-badge": "lg",
			})}
			{...props}
		>
			<Tx
				label={"Continue chat (label)"}
				data-ui-text={"lg"}
			/>
		</LinkTo>
	);
};
