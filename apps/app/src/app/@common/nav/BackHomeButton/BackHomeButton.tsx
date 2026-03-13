import { useLocale } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace BackHomeButton {
	export type Props = {};
}

export const BackHomeButton: FC<BackHomeButton.Props> = () => {
	const locale = useLocale();

	return (
		<LinkTo
			{...uiBackButton({
				className: [],
			})}
			icon={ArrowLeftIcon}
			to="/$locale/home"
			params={{
				locale,
			}}
		/>
	);
};
