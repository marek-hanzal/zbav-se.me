import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import {
	zInboxBuyerMessagePayload,
	zInboxSellerMessagePayload,
	zInboxThumbPayload,
} from "@zbav-se.me/sdk/api/user";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import type { FC } from "react";
import { match } from "ts-pattern";
import { InboxBuyerMessageItem } from "../payload/InboxBuyerMessageItem";
import { InboxSellerMessageItem } from "../payload/InboxSellerMessageItem";
import { InboxThumbItem } from "../payload/InboxThumbItem";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		inboxId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, inboxId, ...props }) => {
	const { data: item } = withInboxQuery.useFetchQuery(inboxId);
	const patchMutation = withInboxQuery.usePatchMutation();

	return (
		<Container
			data-ui="InboxItem[Container]"
			ui={{
				flow: "vertical",
				gap: "xs",
			}}
			{...props}
		>
			{match(item.type)
				.with("seller-message", () => (
					<InboxSellerMessageItem
						item={item}
						payload={zInboxSellerMessagePayload.parse(item.payload)}
					/>
				))
				.with("buyer-message", () => (
					<InboxBuyerMessageItem
						item={item}
						payload={zInboxBuyerMessagePayload.parse(item.payload)}
					/>
				))
				.with("thumb", () => (
					<InboxThumbItem
						item={item}
						payload={zInboxThumbPayload.parse(item.payload)}
					/>
				))
				.exhaustive()}

			{item.archivedAt ? null : (
				<Button
					data-ui="InboxItem[MarkReadButton]"
					onClick={() => {
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
					ui={{
						size: "xs",
						border: true,
						round: "sm",
					}}
				>
					<Tx label="Mark as read (button)" />
				</Button>
			)}
		</Container>
	);
};
