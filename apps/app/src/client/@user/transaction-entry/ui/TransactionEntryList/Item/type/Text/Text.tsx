import { useLocale } from "@use-pico/client/hook";
import type { Container } from "@use-pico/client/ui/container";
import { Mx } from "@use-pico/client/ui/mx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { FC } from "react";
import type { TransactionEntryText } from "~/client/@user/transaction-entry/server/schema/TransactionEntrySchema/TextSchema";
import type { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import { TypeContainer } from "../TypeContainer";

export namespace Text {
	export interface Props extends Container.Props {
		side: UserSideEnumSchema.Type;
		transactionEntry: TransactionEntryText.Type;
	}
}

export const Text: FC<Text.Props> = ({ side, transactionEntry, ...props }) => {
	const locale = useLocale();

	return (
		<TypeContainer
			direction={transactionEntry.direction}
			{...props}
		>
			<Mx
				label={`${side} - ${transactionEntry.payload.text}`}
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
