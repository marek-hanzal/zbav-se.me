import type { FC } from "react";
import type { Container } from "@/lib/client/container";
import { ExternalIcon, Icon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Typo, uiTypo } from "@/lib/client/typo";
import { LabelValue } from "@/lib/client/value";
import { toTimeDiff } from "@/lib/common/time";
import { translator } from "@/lib/common/translator";
import { SendPackageIcon } from "~/common/ui/icon";
import type { TransactionEntryPackage } from "~/user/transaction-entry/server/schema/TransactionEntrySchema/PackageSchema";
import { TypeContainer } from "./TypeContainer";

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
			data-ui={"Package"}
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
