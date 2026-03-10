import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tInboxUnknown } from "@zbav-se.me/sdk/api/user";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import type { FC } from "react";
import { ListItem } from "~/app/@common/list-item/ListItem";

export namespace InboxUnknownItem {
	export interface Props {
		item: tInboxUnknown;
	}
}

export const InboxUnknownItem: FC<InboxUnknownItem.Props> = ({ item }) => {
	const locale = useLocale();
	const patchMutation = withInboxQuery.usePatchMutation({
		invalidate: [
			"count",
		],
	});

	return (
		<ListItem
			hero={undefined}
			title={
				<Tx
					label={"Unknown update (label)"}
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
			onClick={() => {
				if (item.archivedAt) {
					return;
				}
				patchMutation.mutate({
					patch: {
						archivedAt: new Date().toISOString(),
					},
					query: {
						where: {
							id: item.id,
						},
					},
				});
			}}
		/>
	);
};
