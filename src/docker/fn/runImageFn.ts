import { shFn } from "~/shell/fn/shFn";

export namespace runImageFn {
	export interface Props {
		/**
		 * Container (runtime) name
		 */
		name: string;
		/**
		 * Container image to run
		 */
		image: string;
		flags?: string[];
		env?: Record<string, string | number>;
		/**
		 * Exposed ports (optional)
		 */
		port?: string[];
		message?: string;
	}
}

export function runImageFn({
	name,
	image,
	flags = [],
	env = {},
	port = [],
	message,
}: runImageFn.Props) {
	return shFn(
		[
			"docker",
			"run",
			"-d",
			"--name",
			name,
			"--rm",
			...flags,
			//
			...Object.entries(env).flatMap(([k, v]) => {
				return [
					"-e",
					`${k}=${v}`,
				];
			}),
			//
			...port.flatMap((item) => [
				"-p",
				item,
			]),
			image,
		],
		message ?? "Cannot run the image",
	);
}
