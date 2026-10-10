import { getMaybeUploadFn } from "~/gallery/fn/getMaybeUploadFn";

export const getUploadFn = (items: string[]): string => {
	const upload = getMaybeUploadFn(items);

	if (!upload) {
		throw new Error("Upload not found");
	}

	return upload;
};
