import { type FC, useRef } from "react";
import { Container } from "@/lib/client/container";
import type { MarkSuspense } from "@/lib/client/type";
import { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import { TransactionEntryList } from "~/user/transaction-entry/ui/TransactionEntryList";
import { TransactionHero } from "./TransactionHero";
import { TransactionInput } from "./TransactionInput";

export namespace Transaction {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionId: string;
		refresh: number;
	}
}

export const Transaction: FC<Transaction.Props> = ({
	_suspense,
	transactionId,
	refresh,
	ui,
	...props
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui={"Transaction"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				gap: "xs",
				...ui,
			}}
			{...props}
		>
			<Container
				ref={containerRef}
				ui={{
					layout: "vertical-header-content",
					height: "full",
					scroll: "vertical",
				}}
			>
				<TransactionHero
					_suspense={_suspense}
					transactionId={transactionId}
				/>

				<TransactionEntryList
					_suspense={"I know"}
					side={UserSideEnumSchema.enum.buyer}
					containerRef={containerRef}
					transactionId={transactionId}
					refresh={refresh}
					ui={{
						inner: "default",
					}}
				/>
			</Container>

			<TransactionInput
				_suspense={_suspense}
				transactionId={transactionId}
				refresh={refresh}
			/>
		</Container>
	);
};
