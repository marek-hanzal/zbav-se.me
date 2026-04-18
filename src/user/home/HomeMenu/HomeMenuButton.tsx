import type { FC } from "react";
import { LinkTo, type uiLinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { HomeIcon } from "~/common/ui/icon";

export namespace HomeMenuButton {
	export interface Props extends uiLinkTo.Component<{}> {
		//
	}
}

export const HomeMenuButton: FC<HomeMenuButton.Props> = ({ className }) => {
	const locale = useLocale();

	return (
		<LinkTo
			data-ui={"HomeMenuButton"}
			data-action={"go home"}
			icon={HomeIcon}
			to={"/$locale/app/home"}
			params={{
				locale,
			}}
			ui={{
				tone: "neutral",
				theme: "light",
				text: "xl",
				color: "icon",
				round: "full",
				background: "default",
				shadow: true,
				border: true,
				inner: "md",
				opacity: "8",
				...ui,
			}}
			className={className}
		/>
	);
};
