import { translator } from "@use-pico/common/translator";
import type { tTransactionStatusEnum } from "@zbav-se.me/sdk/api/public";
import { match } from "ts-pattern";

export const toStatusLabel = (status: tTransactionStatusEnum) => {
	return match(status)
		.with("pending", () => translator.text("Transaction status pending (label)"))
		.with("open", () => translator.text("Transaction status open (label)"))
		.with("resolved", () => translator.text("Transaction status resolved (label)"))
		.with("dispute", () => translator.text("Transaction status dispute (label)"))
		.with("rejected", () => translator.text("Transaction status rejected (label)"))
		.with("sold", () => translator.text("Transaction status sold (label)"))
		.with("expired", () => translator.text("Transaction status expired (label)"))
		.with("success", () => translator.text("Transaction status success (label)"))
		.with("closed", () => translator.text("Transaction status closed (label)"))
		.exhaustive();
};
