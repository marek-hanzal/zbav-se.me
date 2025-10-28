import { Redis } from "@upstash/redis";
import { AppEnv } from "../AppEnv";

export const redis = new Redis({
	url: AppEnv.SERVER_UPSTASH_REDIS_URL,
	token: AppEnv.SERVER_UPSTASH_REDIS_TOKEN,
});
