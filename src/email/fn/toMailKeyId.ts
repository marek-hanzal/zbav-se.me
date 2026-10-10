import { sha256 } from "js-sha256";

export function toMailKeyId(type: string, payload: Record<string, unknown>) {
	return `${type}/${sha256(JSON.stringify(payload))}`;
}
