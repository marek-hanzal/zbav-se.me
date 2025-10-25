import { AppEnv } from "../AppEnv";

export namespace genKey {
	export interface Props {
		scope: string;
		version: string;
		value: any;
	}
}

export const genKey = ({ scope, version, value }: genKey.Props) => {
	return `${AppEnv.DOMAIN}${scope}:${version}:${JSON.stringify(value)}`;
};
