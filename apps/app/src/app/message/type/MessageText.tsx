import { Container, type uiContainer } from "@use-pico/client/ui/container";
import { Mx } from "@use-pico/client/ui/mx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tMessageText } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace MessageText {
	export interface Props extends Container.Props {
		locale: string;
		message: tMessageText;
	}
}

export const MessageText: FC<MessageText.Props> = ({ locale, message, ...props }) => {
	return (
		<Container
			ui={{
				theme: "light",
				background: "alt",
				border: true,
				shadow: true,
				inner: "default",
				round: "default",
				...match<typeof message.direction, uiContainer.Ui>(message.direction)
					.with("in", () => {
						return {
							tone: "primary",
						};
					})
					.with("out", () => {
						return {
							tone: "secondary",
							justify: "end",
						};
					})
					.with("system", () => {
						return {
							tone: "neutral",
							justify: "center",
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
			]}
			{...props}
		>
			<Mx label={message.text} />

			<Typo
				label={toTimeDiff({
					locale,
					time: message.createdAt,
					type: "relative",
				})}
				ui={{
					text: "sm",
					opacity: "medium",
				}}
			/>
		</Container>
	);
};
