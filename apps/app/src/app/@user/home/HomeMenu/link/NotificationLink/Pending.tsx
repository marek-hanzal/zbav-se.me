import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, type Icon, NotificationIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace Pending {
	export interface Props {
		iconProps?: Icon.PropsEx;
		onLinkClick?: () => void;
	}
}

export const Pending: FC<Pending.Props> = ({ iconProps, onLinkClick }) => {
	const locale = useLocale();

	return (
		<Group
			ui={{
				tone: "neutral",
				theme: "light",
				background: "default",
			}}
		>
			<TypoIcon
				icon={NotificationIcon}
				iconProps={iconProps}
				ui={{
					inner: "lg",
					justify: "start",
					text: "lg",
				}}
			>
				<Tx label={"Notifications (label)"} />
			</TypoIcon>

			<Container
				ui={{
					flow: "horizontal",
					justify: "space-evenly",
					inner: "default",
				}}
			>
				<LinkTo
					to={"/$locale/inbox/$type"}
					icon={ChevronRightIcon}
					iconPosition={"right"}
					onClick={onLinkClick}
					params={{
						locale,
						type: "high",
					}}
					activeProps={uiMenuButton({
						ui: {
							flow: "horizontal",
							justify: "center",
							items: "center",
							tone: "primary",
							theme: "light",
						},
						className: [],
					})}
					{...uiMenuButton({
						ui: {
							flow: "horizontal",
							justify: "center",
							items: "center",
							tone: "neutral",
							theme: "light",
							text: "lg",
						},
						className: [],
					})}
				>
					<Tx label={"Priority (label)"} />
				</LinkTo>

				<LinkTo
					to={"/$locale/inbox/$type"}
					icon={ChevronRightIcon}
					iconPosition={"right"}
					onClick={onLinkClick}
					params={{
						locale,
						type: "common",
					}}
					activeProps={uiMenuButton({
						ui: {
							flow: "horizontal",
							justify: "center",
							items: "center",
							tone: "primary",
							theme: "light",
						},
						className: [],
					})}
					{...uiMenuButton({
						ui: {
							flow: "horizontal",
							justify: "center",
							items: "center",
							tone: "neutral",
							theme: "light",
							text: "lg",
						},
						className: [],
					})}
				>
					<Tx label={"Others (label)"} />
				</LinkTo>
			</Container>
		</Group>
	);
};
