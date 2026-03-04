import { useLocale } from "@use-pico/client/hook";
import { UserIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace Pending {
	export interface Props extends Pick<LinkTo.Props, "ui" | "iconProps"> {
		//
	}
}

export const Pending: FC<Pending.Props> = (props) => {
	const locale = useLocale();

	return (
		<LinkTo
			{...uiMenuButton({
				className: [],
			})}
			icon={UserIcon}
			to="/$locale/user"
			params={{
				locale,
			}}
			activeProps={uiMenuButton({
				ui: {
					tone: "primary",
					theme: "light",
				},
				className: [],
			})}
			{...props}
		>
			<Tx label={"Loading... (label)"} />
		</LinkTo>
	);
};
