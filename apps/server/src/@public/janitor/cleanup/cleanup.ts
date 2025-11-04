import { cleanupCategory } from "./cleanupCategory";
import { cleanupUpload } from "./cleanupUpload";

export const cleanup = [
	cleanupUpload,
	cleanupCategory,
] as const;
