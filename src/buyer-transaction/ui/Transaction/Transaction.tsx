import { type FC, useRef } from "react";
import { TransactionHero } from "~/buyer-transaction/ui/Transaction/TransactionHero";
import { TransactionInput } from "~/buyer-transaction/ui/Transaction/TransactionInput";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { UserSideEnumSchema } from "~/user-event-contract/schema/UserSideEnumSchema";
import { TransactionEntryList } from "~/user-transaction-entry/ui/TransactionEntryList/index";

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
