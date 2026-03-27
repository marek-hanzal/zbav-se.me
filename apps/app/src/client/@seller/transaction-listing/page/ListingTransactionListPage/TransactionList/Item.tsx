import { useLocale } from "@use-pico/client/hook";
import { MessageIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Typo } from "@use-pico/client/ui/typo";
import { withFallback } from "@use-pico/client/utils";
import { toTimeDiff } from "@use-pico/common/time";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { ListItem } from "~/client/@common/list-item/ListItem";
import { ListItemPending } from "~/client/@common/list-item/ListItemPending";
import { toActivityLabel } from "~/client/@seller/transaction/~public/toStatusLabel";
import { withTransactionQuery } from "~/client/@seller/transaction/withTransactionQuery";
import { StatusIcon } from "./StatusIcon";

export namespace Item {
	export interface Props extends ListItem.PropsEx, MarkSuspense.Props {
		transactionId: string;
	}
}

export const Item = withFallback(({ _suspense, transactionId, ...props }: Item.Props) => {
	const locale = useLocale();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);
	const unreadCount = transaction.unreadCount ?? 0;
	const isUnread = unreadCount > 0;

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
						})}
						ui={{
							tone: "neutral",
							theme: "light",
							color: "text",
							text: "sm",
						}}
					/>
				}
				bottom={
					<Container
						ui={{
							tone: "neutral",
							theme: "light",
							color: "text",
							flow: "horizontal",
							width: "full",
							justify: "space-between",
							items: "center",
						}}
					>
						{unreadCount > 0 ? (
							<TypoIcon icon={MessageIcon}>
								<Typo label={`x${unreadCount > 9 ? "9+" : unreadCount}`} />
							</TypoIcon>
						) : (
							<div />
						)}

						<Typo
							label={toTimeDiff({
								locale,
								time: transaction.updatedAt,
							})}
							ui={{
								text: "xs",
								opacity: isUnread ? undefined : "7",
								font: "normal",
							}}
							className={"min-w-fit"}
						/>
					</Container>
				}
				{...props}
			/>
		</LinkTo>
	);
}, ListItemPending);
