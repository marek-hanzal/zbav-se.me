import type { FC } from "react";
import { toTimeDiffFn } from "~/date/fn/toTimeDiffFn";
import { useLocale } from "~/locale/hook/useLocale";
import type { Container } from "~/ui/ui/Container";
import { Markdown } from "~/ui/ui/Markdown";
import { Typo } from "~/ui/ui/Typo";
import type { UserSideEnumSchema } from "~/user-event-contract/schema/UserSideEnumSchema";
import type { TransactionEntryText } from "~/user-transaction-entry/schema/TransactionEntryTextSchema";
import { TypeContainer } from "~/user-transaction-entry/ui/TransactionEntryList/Item/TypeContainer";

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
			data-ui={"Text"}
			direction={transactionEntry.direction}
			{...props}
		>
			<Markdown>{transactionEntry.payload.text}</Markdown>

			<Typo
				label={toTimeDiffFn({
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
