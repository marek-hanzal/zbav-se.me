import { shQuietFn } from "~/shell/fn/shQuietFn";

export namespace rmImageFn {
	export interface Props {
		image: string;
	}
}

export function rmImageFn({ image }: rmImageFn.Props) {
	return shQuietFn([
		"docker",
		"rm",
		"-f",
		"-v",
		image,
	]);
}
