import { useLocale } from "@use-pico/client/hook";
import { Container, type uiContainer } from "@use-pico/client/ui/container";
import { Mx } from "@use-pico/client/ui/mx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import type { tMessageText } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace MessageText {
	export interface Props extends Container.Props {
		/**
		 * From which point of view the message is displayed
		 */
		side: tUserSideEnum;
		message: tMessageText;
	}
}

export const MessageText: FC<MessageText.Props> = ({ side, message, ...props }) => {
	const locale = useLocale();

	return (
		<Container
			ui={{
				theme: "light",
				background: "alt",
				border: true,
				inner: "default",
				round: "default",
				...match<typeof message.direction, uiContainer.Ui>(message.direction)
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
				message.direction === "in" ? [] : undefined,
				message.direction === "out"
					? [
							"ml-auto",
						]
					: undefined,
				message.direction === "system"
					? [
							"w-full",
						]
					: undefined,
			]}
			{...props}
		>
			<Mx
				label={`${side} - ${message.text}`}
				fallback={message.text}
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
