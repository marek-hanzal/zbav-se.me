import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, type Icon, MessageIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";

export namespace MessageLink {
	export interface Props extends MarkSuspense.Props {
		iconProps?: Icon.PropsEx;
	}
}

export const MessageLink = withFallback(
	({ _suspense, iconProps }: MessageLink.Props) => {
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
						data-action={"open seller messages"}
						to={"/$locale/app/seller/transaction/list"}
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
						data-action={"open buyer messages"}
						to={"/$locale/app/buyer/transaction/list"}
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
	},
	({ iconProps }: Omit<MessageLink.Props, "_suspense">) => {
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
					<Tx label={"Loading... (label)"} />
				</TypoIcon>

				<Container
					ui={{
						flow: "horizontal",
						justify: "space-evenly",
						inner: "default",
					}}
				>
					<LinkTo
						data-action={"open seller messages"}
						to={"/$locale/app/seller/transaction/list"}
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
						<Tx label={"Loading... (label)"} />
					</LinkTo>

					<LinkTo
						data-action={"open buyer messages"}
						to={"/$locale/app/buyer/transaction/list"}
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
						<Tx label={"Loading... (label)"} />
					</LinkTo>
				</Container>
			</Group>
		);
	},
);
