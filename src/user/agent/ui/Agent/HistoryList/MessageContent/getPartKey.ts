import type { MessageContentPartValue } from "./getMessageContentParts";

export function getPartKey(part: MessageContentPartValue, countByFingerprint: Map<string, number>) {
	const fingerprint = JSON.stringify(part);
	const count = countByFingerprint.get(fingerprint) ?? 0;

	countByFingerprint.set(fingerprint, count + 1);

	return `${fingerprint}-${count}`;
}
