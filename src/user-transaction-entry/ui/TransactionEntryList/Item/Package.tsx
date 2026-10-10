import type { FC } from "react";
import { SendPackageIcon } from "~/application-ui/constant/icon.exports";
import { toTimeDiff } from "~/date/fn/toTimeDiff";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { ExternalIcon } from "~/ui/constant/ExternalIcon";
import { uiTypo } from "~/ui/fn/uiTypo";
import type { Container } from "~/ui/ui/Container";
import { Icon } from "~/ui/ui/Icon";
import { LabelValue } from "~/ui/ui/LabelValue";
import { Typo } from "~/ui/ui/Typo";
import type { TransactionEntryPackage } from "~/user-transaction-entry/schema/TransactionEntryPackageSchema";
import { TypeContainer } from "~/user-transaction-entry/ui/TransactionEntryList/Item/TypeContainer";

export namespace Package {
	export interface Props extends Container.Props {
		transactionEntry: TransactionEntryPackage.Type;
	}
}

export const Package: FC<Package.Props> = ({ transactionEntry, ...props }) => {
	const translator = useTranslator();
	const locale = useLocale();
	const url = new URL(transactionEntry.payload.link);
	const domain = url.hostname.replace(/^www\./, "");

	return (
		<TypeContainer
			data-ui={"Package"}
			direction={transactionEntry.direction}
			data-ui-flow="vertical"
			data-ui-gap="xs"
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
							"data-ui-wrap": "wrap",
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
						data-ui-text="lg"
					/>
				}
				data-ui-shadow={undefined}
			/>

			<LabelValue
				textLabel={translator.text("Tracking number (label)")}
				textValue={transactionEntry.payload.number}
				textEmpty={translator.text("Tracking number not filled")}
				action={
					<Icon
						icon={SendPackageIcon}
						data-ui-text="lg"
					/>
				}
				data-ui-shadow={undefined}
			/>

			<Typo
				label={toTimeDiff({
					locale,
					time: transactionEntry.createdAt,
					type: "relative",
				})}
				data-ui-text="sm"
				data-ui-opacity="6"
			/>
		</TypeContainer>
	);
};
