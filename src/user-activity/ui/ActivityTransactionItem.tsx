import type { FC } from "react";
import { match } from "ts-pattern";
import type { TransactionSchema } from "~/database/schema/ActivityTableTransactionSchema";
import { toTimeDiffFn } from "~/date/fn/toTimeDiffFn";
import { ListItem } from "~/list-item/ui/ListItem";
import { useLocale } from "~/locale/hook/useLocale";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { LinkTo } from "~/ui/ui/LinkTo";
import { Typo } from "~/ui/ui/Typo";
import { withActivityQuery } from "~/user-activity/query/withActivityQuery";

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
							label={toTimeDiffFn({
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
