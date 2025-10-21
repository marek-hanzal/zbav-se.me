import { AppEnv } from "../AppEnv";
import { redis } from "./redis";

export namespace genKey {
	export interface Props {
		scope: string;
		value: any;
	}
}

export const genKey = async ({ scope, value }: genKey.Props) => {
	const version = (await redis.get<string>(`${scope}:version`)) ?? "1";

	return `${AppEnv.ORIGIN}${scope}:${version}:${JSON.stringify(value)}`;
};
