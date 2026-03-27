import { useLocale } from "@use-pico/client/hook";
import { ExternalIcon, Icon } from "@use-pico/client/icon";
import type { Container } from "@use-pico/client/ui/container";
import { LabelValue } from "@use-pico/client/ui/container";
import { Typo, uiTypo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import { translator } from "@use-pico/common/translator";
import { SendPackageIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import type { TransactionEntryPackage } from "~/client/@user/transaction-entry/server/schema/TransactionEntrySchema/PackageSchema";
import { TypeContainer } from "../TypeContainer";

export namespace Package {
	export interface Props extends Container.Props {
		transactionEntry: TransactionEntryPackage.Type;
	}
}

export const Package: FC<Package.Props> = ({ transactionEntry, ...props }) => {
	const locale = useLocale();
	const url = new URL(transactionEntry.payload.link);
	const domain = url.hostname.replace(/^www\./, "");

	return (
		<TypeContainer
			direction={transactionEntry.direction}
			ui={{
				flow: "vertical",
				gap: "xs",
			}}
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
		</TypeContainer>
	);
};
