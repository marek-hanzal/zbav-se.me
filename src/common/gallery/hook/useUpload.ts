import { useMaybeUpload } from "./useMaybeUpload";

export const useUpload = (items: string[]): string => {
	const upload = useMaybeUpload(items);

	if (!upload) {
		throw new Error("Upload not found");
	}

	return upload;
};
