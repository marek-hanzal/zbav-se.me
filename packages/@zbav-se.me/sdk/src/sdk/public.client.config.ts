import type { CreateClientConfig } from "../sdk/public/client.gen";

export const createClientConfig: CreateClientConfig = (config) => ({
	...config,
	baseUrl: import.meta.env.VITE_SERVER_API,
});
