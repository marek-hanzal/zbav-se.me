import { useEffect, useMemo, useRef } from "react";
import { getRootLogger } from "./getRootLogger";

export function useRenderLogger(name: string) {
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

	useEffect(() => {
		logger.trace("Mount");

		return () => {
			logger.trace("Unmount");
		};
	}, [
		logger,
	]);

	useEffect(() => {
		if (count.current > 1) {
			logger.trace("Render", {
				count: count.current,
			});
		}
	});
}
