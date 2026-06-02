import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { MessageIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import { ListItem } from "~/common/list-item/ListItem";
import { ListItemPending } from "~/common/list-item/ListItemPending";
import { TypoIcon } from "~/common/ui/typo";
import { withTransactionQuery } from "~/seller/transaction/query/withTransactionQuery";
import { toActivityLabel } from "~/seller/transaction/ui/toActivityLabel";
import { StatusIcon } from "./StatusIcon";

export namespace Item {
	export interface Props extends ListItem.PropsEx, MarkSuspense.Props {
		transactionId: string;
	}
}

export const Item = withFallback(({ _suspense, transactionId, ...props }: Item.Props) => {
	const locale = useLocale();
	const translator = useTranslator();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);
	const isUnread = transaction.unread > 0;

	return (
		<LinkTo
			data-ui={"Item"}
			to="/$locale/app/seller/transaction/$transactionId/detail"
			params={{
				locale,
				transactionId,
			}}
		>
			<ListItem
				hero={<StatusIcon status={transaction.status} />}
				title={
					<Typo
						label={toActivityLabel({
							entry: transaction.entry,
							translator,
						})}
						data-ui-tone="neutral"
						data-ui-theme="light"
						data-ui-color="text"
						data-ui-text="sm"
					/>
				}
				bottom={
					<Container
						data-ui-tone="neutral"
						data-ui-theme="light"
						data-ui-color="text"
						data-ui-flow="horizontal"
						data-ui-width="full"
						data-ui-justify="space-between"
						data-ui-items="center"
					>
						{transaction.unread > 0 ? (
							<TypoIcon icon={MessageIcon}>
								<Typo
									label={`x${transaction.unread > 9 ? "9+" : transaction.unread}`}
								/>
							</TypoIcon>
						) : (
							<div />
						)}

						<Typo
							label={toTimeDiff({
								locale,
								time: transaction.lastAt,
							})}
							data-ui-text="xs"
							data-ui-opacity={isUnread ? undefined : "7"}
							data-ui-font="normal"
							className={"min-w-fit"}
						/>
					</Container>
				}
				{...props}
			/>
		</LinkTo>
	);
}, ListItemPending);
