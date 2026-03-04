import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, NotificationIcon, type uiIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace NotificationLink {
	export interface Props {
		icon: uiIcon.Ui;
	}
}

export const NotificationLink: FC<NotificationLink.Props> = ({ icon }) => {
	const locale = useLocale();

	return (
		<LinkTo
			{...uiMenuButton({
				className: [],
			})}
			icon={NotificationIcon}
			iconProps={{
				ui: {
					...icon,
				},
			}}
			to="/$locale/inbox/list"
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
		>
			<TypoIcon
				flip
				icon={ChevronRightIcon}
				iconProps={{
					ui: {
						opacity: "5",
					},
				}}
			>
				<Tx label="Inbox (label)" />
			</TypoIcon>
		</LinkTo>
	);
};
