import { type FC, type RefObject, Suspense, useRef } from "react";
import { useAutoScroll } from "@/lib/client/auto-scroll";
import { Container } from "@/lib/client/container";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense } from "@/lib/client/type";
import { getRootLogger } from "~/common/log/getRootLogger";
import type { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import { withTransactionEntryQuery } from "~/user/transaction-entry/query/withTransactionEntryQuery";
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
	const { data } = withTransactionEntryQuery.useIdsQuery(
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

	useRenderLogger({
		logger: getRootLogger(),
		name: "TransactionEntryList",
	});

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
