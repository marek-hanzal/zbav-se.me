import { uiMenuButtonFn } from "~/application-ui/fn/ui.exports";
import { TypoIcon } from "~/application-ui/ui/typo.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumberFn } from "~/number/fn/toLocaleNumberFn";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import { LoaderIcon } from "~/ui/constant/LoaderIcon";
import { NotificationIcon } from "~/ui/constant/NotificationIcon";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Badge } from "~/ui/ui/Badge";
import { Container } from "~/ui/ui/Container";
import type { Icon as IconType } from "~/ui/ui/Icon";
import { Icon } from "~/ui/ui/Icon";
import { LinkTo } from "~/ui/ui/LinkTo";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

export namespace NotificationLink {
	export interface Props extends MarkSuspense.Props {
		iconProps?: IconType.PropsEx;
		onLinkClickFn?: () => void;
	}
}

export const NotificationLink = withFallbackFn(
	({ _suspense, iconProps, onLinkClickFn }: NotificationLink.Props) => {
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
				onClick={onLinkClickFn}
				params={{
					locale,
					priority: "high",
				}}
				activeProps={uiMenuButtonFn({
					"data-ui-tone": "primary",
					"data-ui-theme": "light",
				})}
				{...uiMenuButtonFn({
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
									: toLocaleNumberFn({
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
	({ iconProps, onLinkClickFn }: Omit<NotificationLink.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-action={"open notifications"}
				to={"/$locale/app/activity/$priority"}
				icon={NotificationIcon}
				iconProps={iconProps}
				onClick={onLinkClickFn}
				params={{
					locale,
					priority: "high",
				}}
				activeProps={uiMenuButtonFn({
					"data-ui-tone": "primary",
					"data-ui-theme": "light",
				})}
				{...uiMenuButtonFn({
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
