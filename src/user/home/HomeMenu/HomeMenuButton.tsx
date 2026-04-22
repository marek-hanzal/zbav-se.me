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
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-text="xl"
			data-ui-color="icon"
			data-ui-round="full"
			data-ui-background="default"
			data-ui-shadow={false}
			data-ui-border
			data-ui-inner="md"
			data-ui-opacity="8"
			className={className}
		/>
	);
};
