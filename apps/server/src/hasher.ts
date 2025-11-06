import { createHasher } from "@use-pico/common/embedding";

let instance: Awaited<ReturnType<typeof createHasher>> | null = null;

export const hasher = async () => {
	return (instance ??= await createHasher());
};
