import { match } from "ts-pattern";
import { translator } from "@/lib/common/translation";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";
import { TransactionEntryText } from "~/user/transaction-entry/server/schema/TransactionEntrySchema/TextSchema";
import { toStatusLabel } from "./toStatusLabel";

export namespace toActivityLabel {
	export interface Props {
		entry: TransactionEntrySchema.Type;
	}
}

export const toActivityLabel = ({ entry }: toActivityLabel.Props) => {
	return match(entry.kind)
		.with("text", () => {
			const { payload } = TransactionEntryText.parse(entry);
			return payload.text;
		})
		.with("status-interest", () => toStatusLabel("interest"))
		.with("status-trade", () => toStatusLabel("trade"))
		.with("status-resolved", () => toStatusLabel("resolved"))
		.with("status-dispute-buyer", "status-dispute-seller", () => toStatusLabel("dispute"))
		.with("status-rejected-buyer", "status-rejected-seller", () => toStatusLabel("rejected"))
		.with("status-sold", () => toStatusLabel("sold"))
		.with("status-expired", () => toStatusLabel("expired"))
		.with("status-success", () => toStatusLabel("success"))
		.with("status-closed", () => toStatusLabel("closed"))
		.with("gallery", () => translator.text("Transaction row - gallery activity (label)"))
		.with("location", () => translator.text("Transaction row - location activity (label)"))
		.with("package", () => translator.text("Transaction row - package activity (label)"))
		.with("personal", () => translator.text("Transaction row - personal activity (label)"))
		.exhaustive();
};
