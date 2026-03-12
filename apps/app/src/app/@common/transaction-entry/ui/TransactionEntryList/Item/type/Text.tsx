import { useLocale } from "@use-pico/client/hook";
import type { Container } from "@use-pico/client/ui/container";
import { Mx } from "@use-pico/client/ui/mx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import type { tTransactionEntryText } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { TypeContainer } from "./TypeContainer";

export namespace Text {
	export interface Props extends Container.Props {
		/**
		 * From which point of view the message is displayed
		 */
		side: tUserSideEnum;
		transactionEntry: tTransactionEntryText;
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
