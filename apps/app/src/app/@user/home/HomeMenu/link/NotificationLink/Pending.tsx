import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, Icon, LoaderIcon, NotificationIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import type { Data } from "./Data";

export namespace Pending {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const Pending: FC<Pending.Props> = ({ iconProps, onLinkClick }) => {
	const locale = useLocale();

	return (
		<LinkTo
			data-action={"open notifications"}
			to={"/$locale/inbox/$priority"}
			icon={NotificationIcon}
			iconProps={iconProps}
			onClick={onLinkClick}
			params={{
				locale,
				priority: "high",
			}}
			activeProps={uiMenuButton({
				ui: {
					tone: "primary",
					theme: "light",
				},
				className: [],
			})}
			{...uiMenuButton({
				ui: {
					tone: "neutral",
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
				<Container
					ui={{
						flow: "horizontal",
						items: "center",
						gap: "default",
						justify: "space-between",
						width: "full",
					}}
				>
					<Tx label={"Notifications (label)"} />

					<Icon icon={LoaderIcon} />
				</Container>
			</TypoIcon>
		</LinkTo>
	);
};
