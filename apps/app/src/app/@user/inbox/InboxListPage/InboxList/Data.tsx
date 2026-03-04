import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { tInboxQuery } from "@zbav-se.me/sdk/api/user";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import type { FC } from "react";
import { InboxItem } from "../InboxItem/InboxItem";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tInboxQuery;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, query, ...props }) => {
	const { data: inboxList } = withInboxQuery.useCollectionQuery(query);

	return (
		<Container
			data-ui="InboxList[Container]"
			ui={{
				flow: "vertical",
				gap: "default",
			}}
			{...props}
		>
			{inboxList.map((inboxId) => {
				return (
					<InboxItem
						key={inboxId}
						inboxId={inboxId}
					/>
				);
			})}
		</Container>
	);
};
