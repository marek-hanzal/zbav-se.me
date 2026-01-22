import type { CreateClientConfig } from "../api/seller/client.gen";

export const createClientConfig: CreateClientConfig = (config) => {
	return {
		...config,
		baseURL: import.meta.env.VITE_SERVER_API,
		withCredentials: true,
	};
};
