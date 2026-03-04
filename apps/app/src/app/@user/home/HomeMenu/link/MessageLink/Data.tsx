import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, type Icon, MessageIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		iconProps?: Icon.PropsEx;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, iconProps }) => {
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
				icon={MessageIcon}
				iconProps={iconProps}
				ui={{
					inner: "lg",
					justify: "start",
					text: "lg",
				}}
			>
				<Tx label={"Messages (label)"} />
			</TypoIcon>

			<Container
				ui={{
					flow: "horizontal",
					justify: "space-evenly",
					inner: "default",
				}}
			>
				<LinkTo
					to={"/$locale/seller/message/list"}
					icon={ChevronRightIcon}
					iconPosition={"right"}
					params={{
						locale,
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
					<Tx label={"Messages - seller (label)"} />
				</LinkTo>

				<LinkTo
					to={"/$locale/buyer/message/list"}
					icon={ChevronRightIcon}
					iconPosition={"right"}
					params={{
						locale,
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
					<Tx label={"Messages - buyer (label)"} />
				</LinkTo>
			</Container>
		</Group>
	);
};
