import type { FileRoutesByTo } from "~/_route";

export function pathOfFn<TPath extends keyof FileRoutesByTo>(path: TPath) {
	return path;
}
