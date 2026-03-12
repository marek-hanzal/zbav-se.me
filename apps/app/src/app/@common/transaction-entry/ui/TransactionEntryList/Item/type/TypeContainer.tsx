import { Container, type uiContainer } from "@use-pico/client/ui/container";
import type { tTransactionEntryDirectionEnum } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace TypeContainer {
	export interface Props extends Container.Props {
		direction: tTransactionEntryDirectionEnum;
		framed?: boolean;
	}
}

export const TypeContainer: FC<TypeContainer.Props> = ({
	direction,
	framed = true,
	ui,
	className,
	...props
}) => {
	return (
		<Container
			ui={{
				theme: "light",
				background: "alt",
				border: framed,
				inner: framed ? "default" : undefined,
				round: framed ? "default" : undefined,
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
				...ui,
			}}
			className={[
				"w-2/3",
				direction === "out" ? "ml-auto" : undefined,
				direction === "system" ? "w-full" : undefined,
				className,
			]}
			{...props}
		/>
	);
};
