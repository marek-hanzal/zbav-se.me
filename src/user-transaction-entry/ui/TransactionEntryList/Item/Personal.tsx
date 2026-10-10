import type { FC } from "react";
import { CopyIconAction } from "~/clipboard/ui/CopyIconAction";
import { toTimeDiff } from "~/date/fn/toTimeDiff";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import type { Container as ContainerType } from "~/ui/ui/Container";
import { Container } from "~/ui/ui/Container";
import { LabelValue } from "~/ui/ui/LabelValue";
import { Typo } from "~/ui/ui/Typo";
import type { TransactionEntryPersonal } from "~/user-transaction-entry/schema/TransactionEntryPersonalSchema";
import { TypeContainer } from "~/user-transaction-entry/ui/TransactionEntryList/Item/TypeContainer";

export namespace Personal {
	export interface Props extends ContainerType.Props {
		transactionEntry: TransactionEntryPersonal.Type;
	}
}

export const Personal: FC<Personal.Props> = ({ transactionEntry, ...props }) => {
	const locale = useLocale();
	const translator = useTranslator();
	const { name, phone, email } = transactionEntry.payload;

	return (
		<TypeContainer
			data-ui="Personal"
			direction={transactionEntry.direction}
			data-ui-flow="vertical"
			{...props}
		>
			<Container
				data-ui-layout="vertical-flex"
				data-ui-gap="xs"
			>
				{name && (
					<LabelValue
						textLabel={translator.text("Personal - name")}
						textValue={name}
						textLabelProps={{
							"data-ui-text": "default",
							"data-ui-font": "normal",
						}}
						data-ui-background={undefined}
						action={<CopyIconAction text={name} />}
					/>
				)}

				{phone && (
					<LabelValue
						textLabel={translator.text("Personal - phone")}
						textValue={phone}
						textLabelProps={{
							"data-ui-text": "default",
							"data-ui-font": "normal",
						}}
						data-ui-background={undefined}
						action={<CopyIconAction text={phone} />}
					/>
				)}

				{email && (
					<LabelValue
						textLabel={translator.text("Personal - email")}
						textValue={email}
						textLabelProps={{
							"data-ui-text": "default",
							"data-ui-font": "normal",
						}}
						data-ui-background={undefined}
						action={<CopyIconAction text={email} />}
					/>
				)}
			</Container>

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
