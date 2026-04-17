import { useEffect, useMemo, useRef } from "react";
import { getRootLogger } from "./getRootLogger";

export function useRenderLogger(name: string, meta?: Record<string, unknown>) {
	const count = useRef(0);
	const logger = useMemo(() => {
		return getRootLogger([
			"re-render",
			name,
		]);
	}, [
		name,
	]);
	count.current += 1;

	// biome-ignore lint/correctness/useExhaustiveDependencies: One-time
	useEffect(() => {
		logger.trace("Mount", meta);

		return () => {
			logger.trace("Unmount", meta);
		};
	}, []);

	useEffect(() => {
		if (count.current > 1) {
			logger.trace("Render", {
				...meta,
				count: count.current,
			});
		}
	});
}
