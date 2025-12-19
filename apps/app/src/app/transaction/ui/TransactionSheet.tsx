import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useState } from "react";
import { MessageList } from "~/app/message/MessageList";
import { TransactionChat } from "~/app/transaction/ui/TransactionChat";

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
                // const status = transaction.

				return (
					<SheetView
						data-ui={"TransactionSheet-[SheetView]"}
						data-id={transactionId}
						state={{
							value: view,
							set: setView,
						}}
						views={{
							detail: {
								children: (
									<Container
										data-ui={"TransactionSheet-[Container]"}
										ui={{
											layout: "vertical-content-footer",
											height: "full",
											gap: "default",
											inner: "default",
										}}
									>
										<MessageList
											locale={locale}
											messageThreadId={transaction.messageThreadId}
										/>

										<TransactionChat transactionId={transaction.id} />
									</Container>
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
