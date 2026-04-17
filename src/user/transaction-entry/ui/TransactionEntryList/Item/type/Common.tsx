import type { FC } from "react";
import type { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { Mx } from "@/lib/client/mx";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import type { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
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
				ui={{
					text: "sm",
					opacity: "6",
				}}
			/>
		</TypeContainer>
	);
};
