import { createIsomorphicFn } from "@tanstack/react-start";

export namespace isomorphicFn {
	/**
	 * Input props for {@link isomorphicFn}.
	 */
	export interface Props<in TRequest, out TResponse> {
		/**
		 * Shared request pipeline used on both client and server.
		 *
		 * On the client, the function is called as-is.
		 * On the server, the function receives auth headers derived from the
		 * current TanStack Start request context.
		 */
		requestFn(request: TRequest, headers?: Record<string, string>): Promise<TResponse>;
	}
}

/**
 * Wrap a request function into a TanStack Start isomorphic function.
 *
 * The client branch preserves the current browser behavior and calls
 * `requestFn` without any extra headers.
 *
 * The server branch forwards only the incoming `Cookie` header from the
 * current SSR request. This keeps authenticated server-side calls working
 * without leaking unrelated browser request headers into downstream API calls.
 */
export const isomorphicFn = <TRequest, TResponse>({
	requestFn,
}: isomorphicFn.Props<TRequest, TResponse>) => {
	return createIsomorphicFn()
		.client(requestFn)
		.server(async (data: TRequest) => {
			const { getRequestHeaders } = await import("@tanstack/react-start/server");

			return requestFn(data, {
				Cookie: getRequestHeaders().get("cookie"),
			});
		});
};
