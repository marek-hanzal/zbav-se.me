import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { withFallback } from "@use-pico/client/utils";
import type { zInboxPriorityEnum } from "@zbav-se.me/sdk/api/user";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import { Suspense, useMemo } from "react";
import { InboxItem } from "../InboxItem";
import { Empty } from "./Empty";

export namespace InboxList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		priority: zInboxPriorityEnum;
	}
}

export const InboxList = withFallback(({ _suspense, priority, ...props }: InboxList.Props) => {
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
						<Suspense
							key={inboxId}
							fallback={<InboxItem.Fallback />}
						>
							<InboxItem
								_suspense={"I know"}
								inboxId={inboxId}
							/>
						</Suspense>
					);
				})}
			</EmptyState>
		</Container>
	);
}, SpinnerContainer);
