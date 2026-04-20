import { type FC, useRef } from "react";
import { Container } from "@/lib/client/container";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense } from "@/lib/client/type";
import { getRootLogger } from "~/common/log/getRootLogger";
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
	...props
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useRenderLogger({
		logger: getRootLogger(),
		name: "Transaction",
	});

	return (
		<Container
			data-ui={"Transaction"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-gap="xs"
			{...props}
		>
			<Container
				ref={containerRef}
				data-ui-layout="vertical-header-content"
				data-ui-height="full"
				data-ui-scroll="vertical"
				className={[
					"pb-[50%]",
				]}
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
					data-ui-inner="default"
				/>
			</Container>

			<TransactionInput
				_suspense={_suspense}
				transactionId={transactionId}
			/>
		</Container>
	);
};
