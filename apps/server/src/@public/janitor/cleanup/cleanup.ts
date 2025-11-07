import { cleanupCategory } from "./cleanupCategory";
import { cleanupScore } from "./cleanupScore";
import { cleanupUpload } from "./cleanupUpload";

export const cleanup = [
	cleanupCategory,
	cleanupScore,
	cleanupUpload,
] as const;
