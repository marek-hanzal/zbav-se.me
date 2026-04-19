import { CopyIconAction } from "@/lib/client/clipboard/CopyIconAction";
import type { Container as ContainerType } from "@/lib/client/container";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { LabelValue } from "@/lib/client/value";
import { toTimeDiff } from "@/lib/common/time";
import { translator } from "@/lib/common/translator";
import type { TransactionEntryPersonal } from "~/user/transaction-entry/server/schema/TransactionEntrySchema/PersonalSchema";
import { TypeContainer } from "./TypeContainer";

export namespace Personal {
	export interface Props extends ContainerType.Props, MarkSuspense.Props {
		transactionEntry: TransactionEntryPersonal.Type;
	}
}

export const Personal = withFallback(
	({ _suspense, transactionEntry, ...props }: Personal.Props) => {
		const locale = useLocale();
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
	},
	function PersonalFallback({
		transactionEntry,
	}: {
		transactionEntry: Pick<TransactionEntryPersonal.Type, "direction">;
	}) {
		return (
			<TypeContainer
				direction={transactionEntry.direction}
				data-ui-flow="vertical"
				className={"min-h-44"}
			>
				<SpinnerContainer />
			</TypeContainer>
		);
	},
);
