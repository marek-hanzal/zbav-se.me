import { useLocale } from "@use-pico/client/hook";
import {
	ChevronRightIcon,
	Icon,
	type Icon as IconType,
	LoaderIcon,
	NotificationIcon,
} from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";

export namespace NotificationLink {
	export interface Props extends MarkSuspense.Props {
		iconProps?: IconType.PropsEx;
		onLinkClick?: () => void;
	}
}

export const NotificationLink = withFallback(
	({ _suspense, iconProps, onLinkClick }: NotificationLink.Props) => {
		const locale = useLocale();
		const { data: highCount } = withInboxQuery.useCountQuery(
			{
				where: {
					priority: "high",
					archivedAtIsNull: true,
				},
			},
			{
				refetchInterval: 5_000,
			},
		);

		return (
			<LinkTo
				data-action={"open notifications"}
				to={"/$locale/app/inbox/$priority"}
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
						tone: highCount.filter > 0 ? "secondary" : "neutral",
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

						{highCount.filter > 0 ? (
							<Badge
								ui={{
									tone: "secondary",
									theme: "light",
									badge: "xs",
								}}
							>
								{highCount.filter > 9
									? "9+"
									: toLocaleNumber({
											number: highCount.filter,
											locale,
										})}
							</Badge>
						) : (
							<Tx
								label={"Inbox - nothing new (label)"}
								ui={{
									opacity: "6",
								}}
							/>
						)}
					</Container>
				</TypoIcon>
			</LinkTo>
		);
	},
	({ iconProps, onLinkClick }: Omit<NotificationLink.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open notifications"}
				to={"/$locale/app/inbox/$priority"}
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
	},
);
