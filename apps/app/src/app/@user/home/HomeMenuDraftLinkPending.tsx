import { useLocale } from "@use-pico/client/hook";
import type { uiIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { DraftIcon } from "@zbav-se.me/ui/icon";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace HomeMenuDraftLinkPending {
	export interface Props extends LinkTo.Props {
		iconUi: uiIcon.Ui;
	}
}

export const HomeMenuDraftLinkPending: FC<HomeMenuDraftLinkPending.Props> = ({ iconUi }) => {
	const locale = useLocale();

	return (
		<LinkTo
			{...uiMenuButton({
				className: [],
			})}
			icon={DraftIcon}
			iconProps={{
				ui: {
					...iconUi,
				},
			}}
			to="/$locale/flow/seller/draft/resolve"
			params={{
				locale,
			}}
			activeProps={uiMenuButton({
				ui: {
					tone: "link",
					theme: "light",
				},
				className: [],
			})}
		>
			<Tx label={"Loading... (label)"} />
		</LinkTo>
	);
};
