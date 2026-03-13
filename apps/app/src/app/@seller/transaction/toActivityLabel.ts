import { translator } from "@use-pico/common/translator";
import type { tTransactionEntry } from "@zbav-se.me/sdk/api/user";
import { zTransactionEntryText } from "@zbav-se.me/sdk/api/user";
import { match } from "ts-pattern";
import { toStatusLabel } from "./toStatusLabel";

export namespace toActivityLabel {
	export interface Props {
		entry: tTransactionEntry;
	}
}

export const toActivityLabel = ({ entry }: toActivityLabel.Props) => {
	return match(entry.kind)
		.with("text", () => {
			const { payload } = zTransactionEntryText.parse(entry);
			return payload.text;
		})
		.with("status-pending", () => toStatusLabel("pending"))
		.with("status-open", () => toStatusLabel("open"))
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
