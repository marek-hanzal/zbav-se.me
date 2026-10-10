import { match } from "ts-pattern";
import type { TransactionStatusEnumSchema } from "~/transaction-contract/schema/TransactionStatusEnumSchema";
import type { translatorFn as Translator } from "~/translation/fn/translatorFn";

export const toStatusLabelFn = (
	status: TransactionStatusEnumSchema.Type,
	translator: Translator.Translator,
) => {
	return match(status)
		.with("interest", () => translator.textFn("Transaction status interest (label)"))
		.with("trade", () => translator.textFn("Transaction status trade (label)"))
		.with("resolved", () => translator.textFn("Transaction status resolved (label)"))
		.with("dispute", () => translator.textFn("Transaction status dispute (label)"))
		.with("rejected", () => translator.textFn("Transaction status rejected (label)"))
		.with("sold", () => translator.textFn("Transaction status sold (label)"))
		.with("expired", () => translator.textFn("Transaction status expired (label)"))
		.with("success", () => translator.textFn("Transaction status success (label)"))
		.with("closed", () => translator.textFn("Transaction status closed (label)"))
		.exhaustive();
};
