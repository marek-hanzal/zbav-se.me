import type { FC } from "react";
import type { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { Markdown } from "@/lib/client/markdown";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import type { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import type { TransactionEntryText } from "~/user/transaction-entry/server/schema/TransactionEntrySchema/TextSchema";
import { TypeContainer } from "./TypeContainer";

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
