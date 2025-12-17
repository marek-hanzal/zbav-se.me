import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useState } from "react";

export namespace TransactionSheet {
	export type View = "detail";

	export interface Props extends BottomSheet.Props {
		transactionId: string;
	}
}

export const TransactionSheet: FC<TransactionSheet.Props> = ({ transactionId, ...props }) => {
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
								children: "foo",
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
