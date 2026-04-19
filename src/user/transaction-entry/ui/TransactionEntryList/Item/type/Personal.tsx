import type { Container as ContainerType } from "@/lib/client/container";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
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
						<Typo
							label={name}
							data-ui-wrap="wrap"
							data-ui-font="bold"
							className={"py-1"}
						/>
					)}

					{phone && (
						<Typo
							label={phone}
							data-ui-wrap="wrap"
						/>
					)}

					{email && (
						<Typo
							label={email}
							data-ui-wrap="wrap"
							className={"py-1"}
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
