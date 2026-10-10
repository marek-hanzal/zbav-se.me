import { uiMenuButtonFn } from "~/application-ui/fn/ui.exports";
import { TypoIcon } from "~/application-ui/ui/typo.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import { MessageIcon } from "~/ui/constant/MessageIcon";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import type { Icon } from "~/ui/ui/Icon";
import { LinkTo } from "~/ui/ui/LinkTo";

export namespace MessageLink {
	export interface Props extends Group.Props, MarkSuspense.Props {
		iconProps?: Icon.PropsEx;
	}
}

export const MessageLink = withFallbackFn(
	({ _suspense, iconProps, ...props }: MessageLink.Props) => {
		const locale = useLocale();

		return (
			<Group
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-background="default"
				{...props}
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
						activeProps={uiMenuButtonFn({
							"data-ui-flow": "horizontal",
							"data-ui-justify": "center",
							"data-ui-items": "center",
							"data-ui-tone": "primary",
							"data-ui-theme": "light",
						})}
						{...uiMenuButtonFn({
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
						activeProps={uiMenuButtonFn({
							"data-ui-flow": "horizontal",
							"data-ui-justify": "center",
							"data-ui-items": "center",
							"data-ui-tone": "primary",
							"data-ui-theme": "light",
						})}
						{...uiMenuButtonFn({
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
						activeProps={uiMenuButtonFn({
							"data-ui-flow": "horizontal",
							"data-ui-justify": "center",
							"data-ui-items": "center",
							"data-ui-tone": "primary",
							"data-ui-theme": "light",
						})}
						{...uiMenuButtonFn({
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
						activeProps={uiMenuButtonFn({
							"data-ui-flow": "horizontal",
							"data-ui-justify": "center",
							"data-ui-items": "center",
							"data-ui-tone": "primary",
							"data-ui-theme": "light",
						})}
						{...uiMenuButtonFn({
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
