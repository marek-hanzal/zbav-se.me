import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { Group } from "@/lib/client/group";
import { ChevronRightIcon, type Icon, MessageIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
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
