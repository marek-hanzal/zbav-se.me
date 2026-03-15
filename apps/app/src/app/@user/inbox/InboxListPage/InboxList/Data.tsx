import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import type { zInboxPriorityEnum } from "@zbav-se.me/sdk/api/user";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import { type FC, useMemo } from "react";
import { InboxItem } from "../InboxItem";
import { Empty } from "./Empty";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		priority: zInboxPriorityEnum;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, priority, ...props }) => {
	const { data: inboxCollection } = withInboxQuery.useCollectionQuery({
		where: {
			priority,
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
	});

	const check = useMemo(() => {
		return [
			{
				check() {
					return !inboxCollection.length;
				},
				render() {
					return <Empty />;
				},
			},
		] satisfies EmptyState.Check[];
	}, [
		inboxCollection,
	]);

	return (
		<Container
			data-ui="InboxList[Container]"
			ui={{
				flow: "vertical",
				gap: "default",
				height: "full",
				scroll: "vertical",
				inner: "default",
			}}
			{...props}
		>
			<EmptyState check={check}>
				{inboxCollection.map((inboxId) => {
					return (
						<InboxItem
							key={inboxId}
							inboxId={inboxId}
						/>
					);
				})}
			</EmptyState>
		</Container>
	);
};
