import { match } from "ts-pattern";
import type { translator as Translator } from "@/lib/common/translation/translator";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";
import { TransactionEntryText } from "~/user/transaction-entry/server/schema/TransactionEntrySchema/TextSchema";
import { toStatusLabel } from "./toStatusLabel";

export namespace toActivityLabel {
	export interface Props {
		entry: TransactionEntrySchema.Type;
		translator: Translator.Translator;
	}
}

export const toActivityLabel = ({ entry, translator }: toActivityLabel.Props) => {
	return match(entry.kind)
		.with("text", () => {
			const { payload } = TransactionEntryText.parse(entry);
			return payload.text;
		})
		.with("status-interest", () => toStatusLabel("interest", translator))
		.with("status-trade", () => toStatusLabel("trade", translator))
		.with("status-resolved", () => toStatusLabel("resolved", translator))
		.with("status-dispute-buyer", "status-dispute-seller", () =>
			toStatusLabel("dispute", translator),
		)
		.with("status-rejected-buyer", "status-rejected-seller", () =>
			toStatusLabel("rejected", translator),
		)
		.with("status-sold", () => toStatusLabel("sold", translator))
		.with("status-expired", () => toStatusLabel("expired", translator))
		.with("status-success", () => toStatusLabel("success", translator))
		.with("status-closed", () => toStatusLabel("closed", translator))
		.with("gallery", () => translator.text("Transaction row - gallery activity (label)"))
		.with("location", () => translator.text("Transaction row - location activity (label)"))
		.with("package", () => translator.text("Transaction row - package activity (label)"))
		.with("personal", () => translator.text("Transaction row - personal activity (label)"))
		.exhaustive();
};
