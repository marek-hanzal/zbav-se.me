import { Typo } from "@use-pico/client/ui/typo";
import { translator } from "@use-pico/common/translator";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import { toActivityLabel } from "~/app/@seller/transaction/~public/toStatusLabel";

export namespace Preview {
	export interface Props {
		isUnread: boolean;
		transaction: tTransaction;
	}
}

export const Preview: FC<Preview.Props> = ({ isUnread, transaction }) => {
	const { lastKind, lastText } = transaction;

	if (!lastKind) {
		return (
			<Typo
				data-ui="TransactionItemPreview[Fallback]"
				label={translator.text("Transaction row - no activity (label)")}
				ui={{
					text: "sm",
					opacity: isUnread ? undefined : "6",
					font: isUnread ? "bold" : "normal",
				}}
				className={[
					"block",
					"w-full",
					"max-w-full",
					"min-w-0",
					"truncate",
				]}
			/>
		);
	}

	return (
		<Typo
			data-ui="TransactionItemPreview[Value]"
			label={toActivityLabel({
				kind: lastKind,
				text: lastText,
			})}
			ui={{
				text: "sm",
				opacity: isUnread ? undefined : "6",
				font: isUnread ? "bold" : "normal",
			}}
			className={[
				"block",
				"w-full",
				"max-w-full",
				"min-w-0",
				"truncate",
			]}
		/>
	);
};
