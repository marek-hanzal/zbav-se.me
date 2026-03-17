import { useLocale } from "@use-pico/client/hook";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { HomeIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace HomeMenuButton {
	export type Props = {};
}

export const HomeMenuButton: FC<HomeMenuButton.Props> = () => {
	const locale = useLocale();

	return (
		<LinkTo
			data-ui={"HomeMenuButton"}
			data-action={"go home"}
			icon={HomeIcon}
			to={"/$locale/home"}
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
			}}
		/>
	);
};
