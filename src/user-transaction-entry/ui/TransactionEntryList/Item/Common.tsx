import type { FC } from "react";
import { toTimeDiff } from "~/date/fn/toTimeDiff";
import { useLocale } from "~/locale/hook/useLocale";
import { Mx } from "~/translation/ui/Mx";
import type { Container } from "~/ui/ui/Container";
import { Typo } from "~/ui/ui/Typo";
import type { UserSideEnumSchema } from "~/user-event-contract/schema/UserSideEnumSchema";
import type { TransactionEntryCommon } from "~/user-transaction-entry/schema/TransactionEntryCommonSchema";
import { TypeContainer } from "~/user-transaction-entry/ui/TransactionEntryList/Item/TypeContainer";

export namespace Common {
	export interface Props extends Container.Props {
		side: UserSideEnumSchema.Type;
		transactionEntry: TransactionEntryCommon.Type;
	}
}

export const Common: FC<Common.Props> = ({ side, transactionEntry, ...props }) => {
	const locale = useLocale();

	return (
		<TypeContainer
			data-ui={"Common"}
			direction={transactionEntry.direction}
			className={"w-full"}
			{...props}
		>
			<Mx
				label={`transaction - ${side} - ${transactionEntry.payload.text}`}
				fallback={transactionEntry.payload.text}
			/>

			<Typo
				label={toTimeDiff({
					locale,
					time: transactionEntry.createdAt,
					type: "relative",
				})}
				data-ui-text="sm"
				data-ui-opacity="6"
			/>
		</TypeContainer>
	);
};
