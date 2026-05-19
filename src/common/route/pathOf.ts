import type { FileRoutesByTo } from "~/_route";

export function pathOf<TPath extends keyof FileRoutesByTo>(path: TPath) {
	return path;
}
