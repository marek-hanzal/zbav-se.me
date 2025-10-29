import type { genKey } from "./genKey";

export namespace withCache {
	export interface Props<TResult> {
		key: genKey.Props;
		fetch(): Promise<TResult>;
	}
}

export const withCache = async <TResult>({
	key,
	fetch,
}: withCache.Props<TResult>) => {
	// const cachedKey = genKey(key);

	// const cached = await redis.get<TResult>(cachedKey);
	// if (cached) {
	// 	return {
	// 		data: cached,
	// 		hit: true,
	// 	};
	// }
	const result = await fetch();
	// await redis.set(cachedKey, result);
	return {
		data: result,
		hit: false,
	};
};
