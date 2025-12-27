import { Container, type uiContainer } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import type { tMessageLocation } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace MessageLocation {
	export interface Props extends Container.Props {
		message: tMessageLocation;
	}
}

export const MessageLocation: FC<MessageLocation.Props> = ({ message, ...props }) => {
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
							"mx-auto",
							"text-center",
						]
					: undefined,
			]}
			{...props}
		>
			<Typo
				label={message.location.address}
				ui={{
					wrap: "wrap",
				}}
			/>
		</Container>
	);
};
