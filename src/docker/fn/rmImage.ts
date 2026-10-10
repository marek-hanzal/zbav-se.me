import { shQuiet } from "~/shell/fn/shQuiet";

export namespace rmImage {
	export interface Props {
		image: string;
	}
}

export function rmImage({ image }: rmImage.Props) {
	return shQuiet([
		"docker",
		"rm",
		"-f",
		"-v",
		image,
	]);
}
