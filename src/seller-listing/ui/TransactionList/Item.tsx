import { TypoIcon } from "~/application-ui/ui/typo.exports";
import { toTimeDiff } from "~/date/fn/toTimeDiff";
import { ListItem } from "~/list-item/ui/ListItem";
import { ListItemPending } from "~/list-item/ui/ListItemPending";
import { useLocale } from "~/locale/hook/useLocale";
import { StatusIcon } from "~/seller-listing/ui/TransactionList/StatusIcon";
import { withTransactionQuery } from "~/seller-transaction/query/withTransactionQuery";
import { toActivityLabel } from "~/seller-transaction/ui/toActivityLabel";
import { useTranslator } from "~/translation/hook/useTranslator";
import { MessageIcon } from "~/ui/constant/MessageIcon";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { LinkTo } from "~/ui/ui/LinkTo";
import { Typo } from "~/ui/ui/Typo";

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
			data-ui={"Item[LinkTo]"}
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
