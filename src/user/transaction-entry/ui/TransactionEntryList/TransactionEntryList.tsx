import { type FC, type RefObject, Suspense, useRef } from "react";
import { getRootLogger } from "~/common/log/getRootLogger";
import type { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import { useAutoScroll } from "~/navigation/hook/useAutoScroll";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
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
			where: {
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
			data-ui-flow="vertical"
			data-ui-gap="lg"
			data-ui-width={"full"}
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
