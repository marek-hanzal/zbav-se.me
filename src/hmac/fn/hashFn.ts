import { createHmac } from "node:crypto";

const KEY_SEPARATOR = "\u0000";

export namespace hashFn {
	export interface Props {
		key: string[];
		secret: string;
	}
}

export function hashFn({ key, secret }: hashFn.Props) {
	return createHmac("sha256", secret).update(key.join(KEY_SEPARATOR), "utf8").digest("hex");
}
