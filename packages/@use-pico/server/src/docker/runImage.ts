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
		env?: Record<string, string | number>;
		/**
		 * Exposed ports (optional)
		 */
		port?: string[];
	}
}

export function runImage({ name, image, env = {}, port = [] }: runImage.Props) {
	return sh(
		[
			"docker",
			"run",
			"-d",
			"--name",
			name,
			"--rm",
			"--tmpfs",
			"/var/lib/postgresql/data:rw,uid=999,gid=999,mode=0700",
			...Object.entries(env).flatMap(([k, v]) => {
				return [
					"-e",
					`${k}=${v}`,
				];
			}),
			...port.flatMap((item) => [
				"-p",
				item,
			]),
			image,
		],
		"Failed to start Postgres container (port busy?)",
	);
}
