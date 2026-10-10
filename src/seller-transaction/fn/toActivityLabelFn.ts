import { match } from "ts-pattern";
import { toStatusLabelFn } from "~/seller-transaction/fn/toStatusLabelFn";
import type { translatorFn as Translator } from "~/translation/fn/translatorFn";
import type { TransactionEntrySchema } from "~/user-transaction-entry/schema/TransactionEntry";
import { TransactionEntryText } from "~/user-transaction-entry/schema/TransactionEntryTextSchema";

export namespace toActivityLabelFn {
	export interface Props {
		entry: TransactionEntrySchema.Type;
		translator: Translator.Translator;
	}
}

export const toActivityLabelFn = ({ entry, translator }: toActivityLabelFn.Props) => {
	return match(entry.kind)
		.with("text", () => {
			const { payload } = TransactionEntryText.parse(entry);
			return payload.text;
		})
		.with("status-interest", () => toStatusLabelFn("interest", translator))
		.with("status-trade", () => toStatusLabelFn("trade", translator))
		.with("status-resolved", () => toStatusLabelFn("resolved", translator))
		.with("status-dispute-buyer", "status-dispute-seller", () =>
			toStatusLabelFn("dispute", translator),
		)
		.with("status-rejected-buyer", "status-rejected-seller", () =>
			toStatusLabelFn("rejected", translator),
		)
		.with("status-sold", () => toStatusLabelFn("sold", translator))
		.with("status-expired", () => toStatusLabelFn("expired", translator))
		.with("status-success", () => toStatusLabelFn("success", translator))
		.with("status-closed", () => toStatusLabelFn("closed", translator))
		.with("gallery", () => translator.textFn("Transaction row - gallery activity (label)"))
		.with("location", () => translator.textFn("Transaction row - location activity (label)"))
		.with("package", () => translator.textFn("Transaction row - package activity (label)"))
		.with("personal", () => translator.textFn("Transaction row - personal activity (label)"))
		.exhaustive();
};
