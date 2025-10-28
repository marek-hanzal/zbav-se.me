import { Redis } from "@upstash/redis";
import { AppEnv } from "../AppEnv";

export const redis = new Redis({
	url: AppEnv.SERVER_UPSTASH_REDIS_URL,
	token: AppEnv.SERVER_UPSTASH_REDIS_TOKEN,
	keepAlive: true,
	readYourWrites: true,
	enableAutoPipelining: true,
	latencyLogging: true,
	retry: {
		retries: 2,
	},
});
