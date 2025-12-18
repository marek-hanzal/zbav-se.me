import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { translator } from "@use-pico/common/translator";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { CloseButton } from "@zbav-se.me/ui/button";
import { ChatInput } from "@zbav-se.me/ui/chat";
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

										<ChatInput
											value={message}
											onChange={setMessage}
											onSubmit={() => {
												//
											}}
											placeholder={translator.text(
												"Transaction - send a message (placeholder)",
											)}
											loading={false}
										/>
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
