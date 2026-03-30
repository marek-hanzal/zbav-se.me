import { LinkTo } from "@use-pico/client/ui/link-to";
import { toTimeDiff } from "@use-pico/common/time";
import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { ListItem } from "~/common/list-item/ListItem";
import type { SystemSchema } from "~/server/database/@table/InboxTableSchema/SystemSchema";
import { withInboxQuery } from "~/user/inbox/query/withInboxQuery";

export namespace InboxSystemItem {
	export interface Props {
		item: SystemSchema.Type;
	}
}

export const InboxSystemItem: FC<InboxSystemItem.Props> = ({ item }) => {
	const locale = useLocale();
	const patchMutation = withInboxQuery.usePatchMutation({
		invalidate: [
			"count",
		],
	});

	return (
		<LinkTo
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
						label={"System update (label)"}
						ui={{
							tone: item.archivedAt ? "neutral" : "secondary",
							theme: "light",
							font: item.archivedAt ? "normal" : "bold",
							color: "lead",
						}}
					/>
				}
				bottom={
					<Container
						ui={{
							flow: "vertical",
						}}
					>
						<Typo
							label={item.payload.transactionEntryId ?? item.payload.transactionId}
							ui={{
								text: "sm",
							}}
						/>
						<Typo
							label={toTimeDiff({
								locale,
								time: item.timestamp,
							})}
							ui={{
								text: "xs",
								opacity: "7",
							}}
						/>
					</Container>
				}
			/>
		</LinkTo>
	);
};
