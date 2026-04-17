import { useEffect, useMemo, useRef } from "react";
import { getRootLogger } from "./getRootLogger";

export function useRenderLogger(name: string) {
	const renderCount = useRef(0);
	const logger = useMemo(() => {
		return getRootLogger([
			"re-render",
			name,
		]);
	}, [
		name,
	]);
	renderCount.current += 1;

	useEffect(() => {
		logger.trace("Mount");

		return () => {
			logger.trace("Unmount");
		};
	}, [
		logger,
	]);

	useEffect(() => {
		if (renderCount.current > 1) {
			logger.trace("Re-render {*}", {
				renderCount: renderCount.current,
			});
		}
	});
}
