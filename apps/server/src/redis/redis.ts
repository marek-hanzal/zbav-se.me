import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

// export const redis = {
// 	async get<T>(_: string): Promise<T | null> {
// 		return null;
// 	},
// 	async set(_: string, __: unknown) {
// 		//
// 	},
// } as const;
