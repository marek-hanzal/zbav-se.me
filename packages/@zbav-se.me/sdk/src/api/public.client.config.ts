import type { CreateClientConfig } from "../api/public/client.gen";

export const createClientConfig: CreateClientConfig = (config) => {
    return {
        ...config,
        baseURL: import.meta.env.VITE_SERVER_API,
        withCredentials: false,
    };
};
