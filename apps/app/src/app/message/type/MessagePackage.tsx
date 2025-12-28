import { useLocale } from "@use-pico/client/hook";
import { Container, type uiContainer } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tMessagePackage } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace MessagePackage {
	export interface Props extends Container.Props {
		message: tMessagePackage;
	}
}

export const MessagePackage: FC<MessagePackage.Props> = ({ message, ...props }) => {
	const locale = useLocale();

	return (
		<Container
			ui={{
				theme: "light",
				background: "alt",
				border: true,
				flow: "vertical",
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
			<Container
				ui={{
					layout: "vertical-flex",
					gap: "xs",
				}}
			>
				<Typo
					label={message.link}
					ui={{
						wrap: "wrap",
					}}
					className={"py-1"}
				/>

				{message.number && (
					<Typo
						label={message.number}
						ui={{
							wrap: "wrap",
						}}
						className={"py-1"}
					/>
				)}
			</Container>

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
