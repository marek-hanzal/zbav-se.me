import { createHmac } from "node:crypto";

const KEY_SEPARATOR = "\u0000";

export namespace hash {
	export interface Props {
		key: string[];
		secret: string;
	}
}

export function hash({ key, secret }: hash.Props) {
	return createHmac("sha256", secret).update(key.join(KEY_SEPARATOR), "utf8").digest("hex");
}
