import { sh } from "../sh/sh";

export namespace runImage {
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
		props?: Record<string, string | number>;
		env?: Record<string, string | number>;
		/**
		 * Exposed ports (optional)
		 */
		port?: string[];
		message?: string;
	}
}

export function runImage({
	name,
	image,
	flags = [],
	props = {},
	env = {},
	port = [],
	message,
}: runImage.Props) {
	return sh(
		[
			"docker",
			"run",
			"-d",
			"--name",
			name,
			"--rm",
			...flags,
			//
			...Object.entries(props).flatMap(([k, v]) => {
				return [
					"-e",
					`${k}=${v}`,
				];
			}),
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
