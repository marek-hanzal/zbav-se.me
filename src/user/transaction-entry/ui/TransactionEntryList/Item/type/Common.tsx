import type { FC } from "react";
import type { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import { toTimeDiff } from "~/date/fn/toTimeDiff";
import { useLocale } from "~/locale/hook/useLocale";
import { Mx } from "~/translation/ui/Mx";
import type { Container } from "~/ui/ui/Container";
import { Typo } from "~/ui/ui/Typo";
import type { TransactionEntryCommon } from "~/user/transaction-entry/server/schema/TransactionEntrySchema/CommonSchema";
import { TypeContainer } from "./TypeContainer";

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
