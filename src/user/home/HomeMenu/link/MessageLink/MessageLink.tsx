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
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-background="default"
			>
				<TypoIcon
					icon={MessageIcon}
					iconProps={iconProps}
					data-ui-inner="lg"
					data-ui-justify="start"
					data-ui-text="lg"
				>
					<Tx label={"Messages (label)"} />
				</TypoIcon>

				<Container
					data-ui-flow="horizontal"
					data-ui-justify="space-evenly"
					data-ui-inner="default"
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
							"data-ui-flow": "horizontal",
							"data-ui-justify": "center",
							"data-ui-items": "center",
							"data-ui-tone": "primary",
							"data-ui-theme": "light",
						})}
						{...uiMenuButton({
							"data-ui-flow": "horizontal",
							"data-ui-justify": "center",
							"data-ui-items": "center",
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
							"data-ui-text": "lg",
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
							"data-ui-flow": "horizontal",
							"data-ui-justify": "center",
							"data-ui-items": "center",
							"data-ui-tone": "primary",
							"data-ui-theme": "light",
						})}
						{...uiMenuButton({
							"data-ui-flow": "horizontal",
							"data-ui-justify": "center",
							"data-ui-items": "center",
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
							"data-ui-text": "lg",
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
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-background="default"
			>
				<TypoIcon
					icon={MessageIcon}
					iconProps={iconProps}
					data-ui-inner="lg"
					data-ui-justify="start"
					data-ui-text="lg"
				>
					<Tx label={"Loading... (label)"} />
				</TypoIcon>

				<Container
					data-ui-flow="horizontal"
					data-ui-justify="space-evenly"
					data-ui-inner="default"
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
							"data-ui-flow": "horizontal",
							"data-ui-justify": "center",
							"data-ui-items": "center",
							"data-ui-tone": "primary",
							"data-ui-theme": "light",
						})}
						{...uiMenuButton({
							"data-ui-flow": "horizontal",
							"data-ui-justify": "center",
							"data-ui-items": "center",
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
							"data-ui-text": "lg",
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
							"data-ui-flow": "horizontal",
							"data-ui-justify": "center",
							"data-ui-items": "center",
							"data-ui-tone": "primary",
							"data-ui-theme": "light",
						})}
						{...uiMenuButton({
							"data-ui-flow": "horizontal",
							"data-ui-justify": "center",
							"data-ui-items": "center",
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
							"data-ui-text": "lg",
						})}
					>
						<Tx label={"Loading... (label)"} />
					</LinkTo>
				</Container>
			</Group>
		);
	},
);
