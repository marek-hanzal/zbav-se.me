import type { FC } from "react";
import { HomeIcon } from "~/application-ui/constant/icon.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import type { uiLinkToFn } from "~/ui/fn/uiLinkToFn";
import { LinkTo } from "~/ui/ui/LinkTo";

export namespace HomeMenuButton {
	export interface Props extends uiLinkToFn.Component<Pick<LinkTo.Props, "id" | "onKeyDown">> {
		//
	}
}

export const HomeMenuButton: FC<HomeMenuButton.Props> = ({ className, ...props }) => {
	const translator = useTranslator();
	const locale = useLocale();

	return (
		<LinkTo
			data-ui={"HomeMenuButton"}
			data-action={"go home"}
			title={translator.textFn("Go home (aria)")}
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
			{...props}
		/>
	);
};
