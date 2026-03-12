import { translator } from "@use-pico/common/translator";
import type { tTransactionEntryKindEnum } from "@zbav-se.me/sdk/api/seller";
import { match } from "ts-pattern";
import { toStatusLabel } from "./toStatusLabel";

type tActivityKind = null | tTransactionEntryKindEnum;

export namespace toActivityLabel {
	export interface Props {
		kind: tActivityKind;
		text: null | string;
	}
}

export const toActivityLabel = ({ kind, text }: toActivityLabel.Props) => {
	return match(kind)
		.with(null, () => translator.text("Transaction row - no activity (label)"))
		.with("text", () => {
			return text ?? translator.text("Transaction row - no activity (label)");
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
