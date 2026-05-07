import type { FC } from "react";
import { uiButton } from "@/lib/client/button";
import { ArrowRightIcon } from "@/lib/client/icon";
import { LinkTo, type uiLinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";

export namespace ContinueSessionButton {
	export interface Props
		extends uiLinkTo.Component<Pick<LinkTo.Props, "iconProps" | "ref" | "id" | "onKeyDown">> {
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
			{...uiButton({
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
