import { useLocale } from "@use-pico/client/hook";
import { Container, type uiContainer } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { iso2locale } from "@use-pico/common/iso2locale";
import { toTimeDiff } from "@use-pico/common/time";
import type { tMessageDate } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace MessageDate {
	export interface Props extends Container.Props {
		message: tMessageDate;
	}
}

export const MessageDate: FC<MessageDate.Props> = ({ message, ...props }) => {
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
			<Typo
				label={
					iso2locale({
						locale,
						date: message.datetime,
						opts: {
							dateStyle: "full",
							timeStyle: "short",
						},
					}) ?? "-"
				}
				ui={{
					text: "lg",
					wrap: "wrap",
				}}
				className={"py-1"}
			/>

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
