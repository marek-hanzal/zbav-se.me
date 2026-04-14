import { Badge } from "@/lib/client/badge";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import {
	ChevronRightIcon,
	Icon,
	type Icon as IconType,
	LoaderIcon,
	NotificationIcon,
} from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { TypoIcon } from "~/common/ui/typo";
import { uiMenuButton } from "~/common/ui/ui";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";

export namespace NotificationLink {
	export interface Props extends MarkSuspense.Props {
		iconProps?: IconType.PropsEx;
		onLinkClick?: () => void;
	}
}

export const NotificationLink = withFallback(
	({ _suspense, iconProps, onLinkClick }: NotificationLink.Props) => {
		const locale = useLocale();
		const { data: highCount } = withActivityQuery.useCountQuery(
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
				to={"/$locale/app/activity/$priority"}
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
						tone: highCount > 0 ? "secondary" : "neutral",
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

						{highCount > 0 ? (
							<Badge
								ui={{
									tone: "secondary",
									theme: "light",
									badge: "xs",
								}}
							>
								{highCount > 9
									? "9+"
									: toLocaleNumber({
											number: highCount,
											locale,
										})}
							</Badge>
						) : (
							<Tx
								label={"Activity - nothing new (label)"}
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
				to={"/$locale/app/activity/$priority"}
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
