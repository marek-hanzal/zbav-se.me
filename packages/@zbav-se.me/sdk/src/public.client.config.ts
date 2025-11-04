import type { CreateClientConfig } from "./public/client.gen";

export const createClientConfig: CreateClientConfig = (config) => ({
	...config,
	baseUrl: import.meta.env.VITE_SERVER_API,
});
