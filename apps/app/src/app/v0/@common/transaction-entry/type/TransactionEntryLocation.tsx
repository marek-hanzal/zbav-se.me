import { useLocale } from "@use-pico/client/hook";
import { Container, type uiContainer } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tTransactionEntryLocation } from "@zbav-se.me/sdk/api/user";
import { withLocationFetchQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";
import { match } from "ts-pattern";
import { useUser } from "~/app/@common/auth/hook/useUser";

export namespace TransactionEntryLocation {
	export interface Props extends Container.Props {
		message: tTransactionEntryLocation;
	}
}

export const TransactionEntryLocation: FC<TransactionEntryLocation.Props> = ({
	message,
	...props
}) => {
	const locale = useLocale();
	const user = useUser();
	const direction =
		message.userId === null ? "system" : message.userId === user.id ? "out" : "in";
	const { data: location } = withLocationFetchQuery.useSuspenseQuery({
		where: {
			id: message.payload.locationId,
		},
	});

	return (
		<Container
			ui={{
				theme: "light",
				background: "alt",
				border: true,
				flow: "vertical",
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
							"mx-auto",
							"text-center",
						]
					: undefined,
			]}
			{...props}
		>
			<Typo
				label={location.address}
				ui={{
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
					opacity: "6",
				}}
			/>
		</Container>
	);
};
