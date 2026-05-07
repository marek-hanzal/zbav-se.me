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
		const { data: hightList } = withActivityQuery.useCollectionQuery(
			{
				where: {
					priority: "high",
					archivedAtIsNull: true,
				},
				cursor: {
					page: 0,
					size: 1000,
				},
				sort: [
					{
						field: "timestamp",
						order: "desc",
					},
				],
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
					"data-ui-tone": "primary",
					"data-ui-theme": "light",
				})}
				{...uiMenuButton({
					"data-ui-tone": hightList.length > 0 ? "secondary" : "neutral",
					"data-ui-theme": "light",
				})}
			>
				<TypoIcon
					flip
					icon={ChevronRightIcon}
					iconProps={{
						"data-ui-opacity": "5",
					}}
				>
					<Container
						data-ui-flow="horizontal"
						data-ui-items="center"
						data-ui-gap="default"
						data-ui-justify="space-between"
						data-ui-width="full"
					>
						<Tx label={"Notifications (label)"} />

						{hightList.length > 0 ? (
							<Badge
								data-ui-tone="secondary"
								data-ui-theme="light"
								data-ui-badge="xs"
							>
								{hightList.length > 9
									? "9+"
									: toLocaleNumber({
											number: hightList.length,
											locale,
										})}
							</Badge>
						) : (
							<Tx
								label={"Activity - nothing new (label)"}
								data-ui-opacity="6"
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
					"data-ui-tone": "primary",
					"data-ui-theme": "light",
				})}
				{...uiMenuButton({
					"data-ui-tone": "neutral",
					"data-ui-theme": "light",
				})}
			>
				<TypoIcon
					flip
					icon={ChevronRightIcon}
					iconProps={{
						"data-ui-opacity": "5",
					}}
				>
					<Container
						data-ui-flow="horizontal"
						data-ui-items="center"
						data-ui-gap="default"
						data-ui-justify="space-between"
						data-ui-width="full"
					>
						<Tx label={"Notifications (label)"} />

						<Icon icon={LoaderIcon} />
					</Container>
				</TypoIcon>
			</LinkTo>
		);
	},
);
