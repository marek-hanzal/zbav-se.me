import { match } from "ts-pattern";
import type { TransactionStatusEnumSchema } from "~/transaction-contract/schema/TransactionStatusEnumSchema";
import type { translator as Translator } from "~/translation/fn/translator";

export const toStatusLabel = (
	status: TransactionStatusEnumSchema.Type,
	translator: Translator.Translator,
) => {
	return match(status)
		.with("interest", () => translator.text("Transaction status interest (label)"))
		.with("trade", () => translator.text("Transaction status trade (label)"))
		.with("resolved", () => translator.text("Transaction status resolved (label)"))
		.with("dispute", () => translator.text("Transaction status dispute (label)"))
		.with("rejected", () => translator.text("Transaction status rejected (label)"))
		.with("sold", () => translator.text("Transaction status sold (label)"))
		.with("expired", () => translator.text("Transaction status expired (label)"))
		.with("success", () => translator.text("Transaction status success (label)"))
		.with("closed", () => translator.text("Transaction status closed (label)"))
		.exhaustive();
};
