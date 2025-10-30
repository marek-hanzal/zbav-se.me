import type { CreateClientConfig } from "./sdk/client.gen";

export const createClientConfig: CreateClientConfig = (config) => ({
	...config,
	baseUrl: import.meta.env.VITE_SERVER_API,
	credentials: "include",
});
