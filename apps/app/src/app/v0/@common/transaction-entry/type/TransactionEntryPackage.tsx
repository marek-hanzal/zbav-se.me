import { useLocale } from "@use-pico/client/hook";
import { ExternalIcon, Icon } from "@use-pico/client/icon";
import { Container, LabelValue, type uiContainer } from "@use-pico/client/ui/container";
import { Typo, uiTypo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import { translator } from "@use-pico/common/translator";
import type { tTransactionEntryPackage } from "@zbav-se.me/sdk/api/user";
import { SendPackageIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace TransactionEntryPackage {
	export interface Props extends Container.Props {
		transactionEntry: tTransactionEntryPackage;
	}
}

export const TransactionEntryPackage: FC<TransactionEntryPackage.Props> = ({
	transactionEntry,
	...props
}) => {
	const locale = useLocale();
	const url = new URL(transactionEntry.payload.link);
	const domain = url.hostname.replace(/^www\./, "");

	return (
		<Container
			ui={{
				flow: "vertical",
				gap: "xs",
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
				transactionEntry.direction === "out"
					? "ml-auto"
					: undefined,
				transactionEntry.direction === "system"
					? [
							"mx-auto",
							"text-center",
						]
					: undefined,
			]}
			{...props}
		>
			<LabelValue
				textLabel={domain}
				textValue={
					<a
						href={transactionEntry.payload.link}
						target="_blank"
						rel="noopener noreferrer"
						{...uiTypo({
							ui: {
								wrap: "wrap",
							},
							className: [
								"block underline",
							],
						})}
					>
						{transactionEntry.payload.link}
					</a>
				}
				action={
					<Icon
						icon={ExternalIcon}
						ui={{
							text: "lg",
						}}
					/>
				}
				ui={{
					shadow: undefined,
				}}
			/>

			<LabelValue
				textLabel={translator.text("Tracking number (label)")}
				textValue={transactionEntry.payload.number}
				textEmpty={translator.text("Tracking number not filled")}
				action={
					<Icon
						icon={SendPackageIcon}
						ui={{
							text: "lg",
						}}
					/>
				}
				ui={{
					shadow: undefined,
				}}
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
