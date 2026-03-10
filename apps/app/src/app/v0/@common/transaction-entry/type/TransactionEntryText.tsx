import { useLocale } from "@use-pico/client/hook";
import { Container, type uiContainer } from "@use-pico/client/ui/container";
import { Mx } from "@use-pico/client/ui/mx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import type { tTransactionEntryCommon, tTransactionEntryText } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace TransactionEntryText {
	export interface Props extends Container.Props {
		/**
		 * From which point of view the message is displayed
		 */
		side: tUserSideEnum;
		transactionEntry: tTransactionEntryText | tTransactionEntryCommon;
	}
}

export const TransactionEntryText: FC<TransactionEntryText.Props> = ({
	side,
	transactionEntry,
	...props
}) => {
	const locale = useLocale();

	return (
		<Container
			ui={{
				theme: "light",
				background: "alt",
				border: true,
				inner: "default",
				round: "default",
				...match<typeof transactionEntry.direction, uiContainer.Ui>(
					transactionEntry.direction,
				)
					.with("in", () => {
						return {
							tone: "link",
						};
					})
					.with("out", () => {
						return {
							tone: "primary",
						};
					})
					.with("system", () => {
						return {
							tone: "neutral",
						};
					})
					.exhaustive(),
			}}
			className={[
				"w-2/3",
				transactionEntry.direction === "in" ? [] : undefined,
				transactionEntry.direction === "out"
					? [
							"ml-auto",
						]
					: undefined,
				transactionEntry.direction === "system"
					? [
							"w-full",
						]
					: undefined,
			]}
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
		</Container>
	);
};
