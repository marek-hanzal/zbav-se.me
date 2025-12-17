import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useState } from "react";
import { MessageList } from "~/app/message/MessageList";

export namespace TransactionSheet {
	export type View = "detail";

	export interface Props extends BottomSheet.Props {
		locale: string;
		transactionId: string;
	}
}

export const TransactionSheet: FC<TransactionSheet.Props> = ({
	locale,
	transactionId,
	...props
}) => {
	const [view, setView] = useState<TransactionSheet.View>("detail");

	return (
		<withTransactionFetchQuery.Suspense
			data={{
				where: {
					id: transactionId,
				},
			}}
			fallback={null}
		>
			{({ data: transaction }) => {
				return (
					<SheetView
						state={{
							value: view,
							set: setView,
						}}
						views={{
							detail: {
								children: (
									<MessageList
										locale={locale}
										messageThreadId={transaction.messageThreadId}
										ui={{
											inner: "default",
										}}
									/>
								),
								header: ({ close }) => ({
									title: transaction.title,
									right: <CloseButton onClick={close} />,
								}),
							},
						}}
						detent={"full"}
						{...props}
					/>
				);
			}}
		</withTransactionFetchQuery.Suspense>
	);
};
