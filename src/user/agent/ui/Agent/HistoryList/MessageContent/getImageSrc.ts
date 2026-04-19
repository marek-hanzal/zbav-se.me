export type ImageReference =
	| string
	| {
			id: string;
	  }
	| undefined;

export function getImageSrc(image: ImageReference) {
	if (typeof image === "string") {
		return image;
	}

	return undefined;
}
