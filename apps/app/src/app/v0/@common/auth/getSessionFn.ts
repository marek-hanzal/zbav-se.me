import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { authClient } from "./authClient";

export const getSessionFn = createServerFn().handler(async () => {
	return authClient.getSession({
		fetchOptions: {
			headers: getRequestHeaders(),
		},
	});
});
