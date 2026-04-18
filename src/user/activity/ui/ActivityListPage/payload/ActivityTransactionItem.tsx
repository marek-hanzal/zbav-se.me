import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import { ListItem } from "~/common/list-item/ListItem";
import type { TransactionSchema } from "~/server/database/@table/ActivityTableSchema/TransactionSchema";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";

export namespace ActivityTransactionItem {
	export interface Props {
		item: TransactionSchema.Type;
	}
}

export const ActivityTransactionItem: FC<ActivityTransactionItem.Props> = ({ item }) => {
	const locale = useLocale();
	const patchMutation = withActivityQuery.usePatchMutation({
		invalidate: [
			"count",
		],
	});

	return (
		<LinkTo
			data-id={item.id}
			data-ui={"ActivityTransactionItem[Link]"}
			data-action={"open transaction activity item"}
			{...match(item.payload.target)
				.with(
					"buyer",
					() =>
						({
							to: "/$locale/app/buyer/transaction/$transactionId/detail",
							params: {
								locale,
								transactionId: item.payload.transactionId,
							},
						}) as const,
				)
				.with(
					"seller",
					() =>
						({
							to: "/$locale/app/seller/transaction/$transactionId/detail",
							params: {
								locale,
								transactionId: item.payload.transactionId,
							},
						}) as const,
				)
				.exhaustive()}
			onClick={() => {
				if (item.archivedAt) {
					return;
				}
				patchMutation.mutate({
					patch: {
						archivedAt: new Date(),
					},
					query: {
						where: {
							id: item.id,
						},
					},
				});
			}}
		>
			<ListItem
				hero={undefined}
				title={
					<Tx
						label={"Transaction update (label)"}
						data-ui-tone={item.archivedAt ? "neutral" : "secondary"}
						data-ui-theme="light"
						data-ui-font={item.archivedAt ? "normal" : "bold"}
						data-ui-color="lead"
					/>
				}
				bottom={
					<Container data-ui-flow="vertical">
						<Typo
							label={item.payload.transactionEntryId ?? item.payload.transactionId}
							data-ui-text="sm"
						/>
						<Typo
							label={toTimeDiff({
								locale,
								time: item.timestamp,
							})}
							data-ui-text="xs"
							data-ui-opacity="7"
						/>
					</Container>
				}
			/>
		</LinkTo>
	);
};
