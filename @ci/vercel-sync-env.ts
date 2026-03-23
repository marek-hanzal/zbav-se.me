namespace VercelSyncEnv {
	export type ValueType = "plain" | "sensitive";
	export type Target = "production" | "preview" | "development";

	export interface Config {
		keys: string[];
		projectId: string;
		sensitiveKeys: Set<string>;
		target: Target;
		teamId: string;
		token: string;
	}

	export interface ProjectEnv {
		id: string;
		key: string;
		system?: boolean;
		target?: string[];
	}

	export interface CreateEnvRequestItem {
		key: string;
		target: Target[];
		type: ValueType;
		value: string;
	}

	export interface ErrorBody {
		error?: {
			code?: string;
			message?: string;
		};
	}
}

const REQUIRED_ENV_KEYS = [
	"KEYS",
	"VERCEL_PROJECT_ID",
	"VERCEL_TOKEN",
	"VERCEL_ORG_ID",
] as const;

const parseMultilineEnv = (value: string | undefined): string[] => {
	return (value ?? "")
		.split("\n")
		.map((item) => item.trim())
		.filter((item) => item.length > 0 && !item.startsWith("#"));
};

const readRequiredEnv = (key: (typeof REQUIRED_ENV_KEYS)[number]): string => {
	const value = process.env[key]?.trim();

	if (!value) {
		throw new Error(`Missing required environment variable '${key}'.`);
	}

	return value;
};

const getEnvValueType = (key: string, sensitiveKeys: Set<string>): VercelSyncEnv.ValueType => {
	return sensitiveKeys.has(key) ? "sensitive" : "plain";
};

const buildPayload = (config: VercelSyncEnv.Config): VercelSyncEnv.CreateEnvRequestItem[] => {
	return config.keys.map((key) => {
		const value = process.env[key];

		if (!value) {
			throw new Error(`Environment variable '${key}' is not set.`);
		}

		return {
			key,
			target: [
				config.target,
			],
			type: getEnvValueType(key, config.sensitiveKeys),
			value,
		};
	});
};

const readConfig = (): VercelSyncEnv.Config => {
	for (const key of REQUIRED_ENV_KEYS) {
		readRequiredEnv(key);
	}

	const keys = parseMultilineEnv(process.env.KEYS);
	if (keys.length === 0) {
		throw new Error("No environment keys were provided in KEYS.");
	}

	const targetValue = (process.env.TARGET?.trim() || "production") as VercelSyncEnv.Target;
	if (
		![
			"production",
			"preview",
			"development",
		].includes(targetValue)
	) {
		throw new Error(`Unsupported TARGET '${targetValue}'.`);
	}

	return {
		keys,
		projectId: readRequiredEnv("VERCEL_PROJECT_ID"),
		sensitiveKeys: new Set(parseMultilineEnv(process.env.SENSITIVE_KEYS)),
		target: targetValue,
		teamId: readRequiredEnv("VERCEL_ORG_ID"),
		token: readRequiredEnv("VERCEL_TOKEN"),
	};
};

const getHeaders = (token: string): HeadersInit => {
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};
};

const getApiUrl = (path: string, teamId: string): string => {
	const url = new URL(`https://api.vercel.com${path}`);
	url.searchParams.set("teamId", teamId);
	return url.toString();
};

const parseErrorBody = async (response: Response): Promise<string> => {
	try {
		const body = (await response.json()) as VercelSyncEnv.ErrorBody;
		return body.error?.message || JSON.stringify(body);
	} catch {
		return await response.text();
	}
};

const fetchExistingEnvs = async (
	config: VercelSyncEnv.Config,
): Promise<VercelSyncEnv.ProjectEnv[]> => {
	const response = await fetch(
		getApiUrl(`/v10/projects/${config.projectId}/env`, config.teamId),
		{
			headers: getHeaders(config.token),
			method: "GET",
		},
	);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch Vercel envs: ${response.status} ${await parseErrorBody(response)}`,
		);
	}

	return (await response.json()) as VercelSyncEnv.ProjectEnv[];
};

const deleteExistingEnvs = async (config: VercelSyncEnv.Config, ids: string[]): Promise<void> => {
	if (ids.length === 0) {
		return;
	}

	const response = await fetch(getApiUrl(`/v1/projects/${config.projectId}/env`, config.teamId), {
		body: JSON.stringify({
			ids,
		}),
		headers: getHeaders(config.token),
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error(
			`Failed to delete Vercel envs: ${response.status} ${await parseErrorBody(response)}`,
		);
	}
};

const createEnvs = async (
	config: VercelSyncEnv.Config,
	payload: VercelSyncEnv.CreateEnvRequestItem[],
): Promise<void> => {
	const url = new URL(getApiUrl(`/v10/projects/${config.projectId}/env`, config.teamId));
	url.searchParams.set("upsert", "true");

	const response = await fetch(url.toString(), {
		body: JSON.stringify(payload),
		headers: getHeaders(config.token),
		method: "POST",
	});

	if (!response.ok) {
		throw new Error(
			`Failed to create Vercel envs: ${response.status} ${await parseErrorBody(response)}`,
		);
	}

	const body = (await response.json()) as {
		failed?: unknown[];
	};
	if (Array.isArray(body.failed) && body.failed.length > 0) {
		throw new Error(
			`Vercel reported ${body.failed.length} failed environment variable operations.`,
		);
	}
};

const run = async (): Promise<void> => {
	const config = readConfig();
	const payload = buildPayload(config);
	const existingEnvs = await fetchExistingEnvs(config);
	const existingIds = existingEnvs
		.filter((item) => item.system !== true && item.target?.includes(config.target))
		.map((item) => item.id);

	await deleteExistingEnvs(config, existingIds);
	console.log(`Deleted ${existingIds.length} existing environment variables from Vercel.`);

	await createEnvs(config, payload);
	console.log(`Synced ${payload.length} environment variables to Vercel.`);
};

await run();
