import { useLocale } from "@use-pico/client/hook";
import { Container, type uiContainer } from "@use-pico/client/ui/container";
import { Mx } from "@use-pico/client/ui/mx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import type { tTransactionEntryCommon, tTransactionEntryText } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { useUser } from "~/app/@common/auth/hook/useUser";

export namespace TransactionEntryText {
	export interface Props extends Container.Props {
		/**
		 * From which point of view the message is displayed
		 */
		side: tUserSideEnum;
		message: tTransactionEntryText | tTransactionEntryCommon;
	}
}

export const TransactionEntryText: FC<TransactionEntryText.Props> = ({
	side,
	message,
	...props
}) => {
	const locale = useLocale();
	const user = useUser();
	const direction =
		message.userId === null ? "system" : message.userId === user.id ? "out" : "in";

	return (
		<Container
			ui={{
				theme: "light",
				background: "alt",
				border: true,
				inner: "default",
				round: "default",
				...match<typeof direction, uiContainer.Ui>(direction)
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
				direction === "in" ? [] : undefined,
				direction === "out"
					? [
							"ml-auto",
						]
					: undefined,
				direction === "system"
					? [
							"w-full",
						]
					: undefined,
			]}
			{...props}
		>
			<Mx
				label={`${side} - ${message.payload.text}`}
				fallback={message.payload.text}
			/>

			<Typo
				label={toTimeDiff({
					locale,
					time: message.createdAt,
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
