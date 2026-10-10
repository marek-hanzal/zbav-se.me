import type { Logger } from "@logtape/logtape";
import { useEffect, useMemo, useRef } from "react";

export namespace useRenderLogger {
	export interface Props {
		logger: Logger;
		name: string;
		meta?: Record<string, unknown>;
	}
}

export function useRenderLogger({ logger, name, meta }: useRenderLogger.Props) {
	const count = useRef(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Frozen at first time
	const $logger = useMemo(() => {
		return logger.getChild([
			"hook",
			"useRenderLogger",
			name,
		]);
	}, []);
	count.current += 1;

	// biome-ignore lint/correctness/useExhaustiveDependencies: One-time
	useEffect(() => {
		$logger.trace("Mount", meta);

		return () => {
			$logger.trace("Unmount", meta);
		};
	}, []);

	useEffect(() => {
		$logger.trace("Render", {
			...meta,
			count: count.current - 1,
		});
	});
}
