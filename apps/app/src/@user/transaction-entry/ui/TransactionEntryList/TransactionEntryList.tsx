import { useAutoScroll } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { type FC, type RefObject, Suspense, useRef } from "react";
import { withTransactionEntryQuery } from "~/@user/transaction-entry/query/withTransactionEntryQuery";
import type { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import { Item } from "./Item";

export namespace TransactionEntryList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		side: UserSideEnumSchema.Type;
		containerRef: RefObject<HTMLDivElement | null>;
		transactionId: string;
		refresh: number;
	}
}

export const TransactionEntryList: FC<TransactionEntryList.Props> = ({
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
			cursor: {
				page: 0,
				size: 1000,
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
			data-ui="TransactionEntryList"
			ref={contentRef}
			ui={{
				flow: "vertical",
				gap: "lg",
				...ui,
			}}
			{...props}
		>
			{data.map((transactionEntryId) => {
				return (
					<Suspense
						key={transactionEntryId}
						fallback={<Item.Fallback />}
					>
						<Item
							_suspense={"I know"}
							side={side}
							transactionEntryId={transactionEntryId}
						/>
					</Suspense>
				);
			})}

			{children}
		</Container>
	);
};
