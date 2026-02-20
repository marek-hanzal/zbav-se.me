const MIN_CONCURRENCY = 1;
const MAX_CONCURRENCY = 64;
const DEFAULT_CONCURRENCY = 7;

const withNumber = (value?: string) => {
	if (!value) {
		return undefined;
	}

	const parsed = Number.parseInt(value, 10);
	if (!Number.isFinite(parsed)) {
		return undefined;
	}

	return parsed;
};

export const withSeedConcurrency = (key: string) => {
	const specific = withNumber(process.env[key]);
	const shared = withNumber(process.env.SEED_CORE_CONCURRENCY);
	const raw = specific ?? shared ?? DEFAULT_CONCURRENCY;

	return Math.max(MIN_CONCURRENCY, Math.min(MAX_CONCURRENCY, raw));
};
