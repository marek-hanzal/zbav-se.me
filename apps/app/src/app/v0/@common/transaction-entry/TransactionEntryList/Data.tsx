import { useAutoScroll } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import { type FC, type RefObject, useRef } from "react";
import { Item } from "./Item";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		side: tUserSideEnum;
		containerRef: RefObject<HTMLDivElement | null>;
		transactionId: string;
		refresh: number;
	}
}

export const Data: FC<Data.Props> = ({
	_suspense,
	side,
	transactionId,
	containerRef,
	ui,
	children,
	refresh,
	...props
}) => {
	const contentRef = useRef<HTMLDivElement>(null);
	useAutoScroll({
		containerRef,
		contentRef,
	});
	const { data } = withTransactionEntryQuery.useCollectionQuery(
		{
			filter: {
				transactionId,
			},
			sort: [
				{
					field: "createdAt",
					order: "asc",
				},
			],
		},
		{
			refetchInterval: refresh,
		},
	);

	return (
		<Container
			data-ui="MessageList-[Container]"
			ref={contentRef}
			ui={{
				flow: "vertical",
				gap: "lg",
				...ui,
			}}
			className={"py-1"}
			{...props}
		>
			{data.map((transactionEntryId) => {
				return (
					<Item
						key={transactionEntryId}
						side={side}
						transactionEntryId={transactionEntryId}
					/>
				);
			})}

			{children}
		</Container>
	);
};
