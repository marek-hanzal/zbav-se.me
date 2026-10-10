import { useCallback, useRef } from "react";

export namespace useDoubleTap {
	export interface Props {
		onDoubleTapFn(): void;
		delay?: number;
	}
}

export const useDoubleTap = ({ onDoubleTapFn, delay = 300 }: useDoubleTap.Props) => {
	const lastTapRef = useRef<number>(0);

	const handleTouchStartFn = useCallback(
		(event: React.TouchEvent) => {
			const currentTime = Date.now();
			const tapLength = currentTime - lastTapRef.current;

			if (tapLength < delay && tapLength > 0) {
				event.preventDefault();
				onDoubleTapFn();
			}

			lastTapRef.current = currentTime;
		},
		[
			onDoubleTapFn,
			delay,
		],
	);

	return {
		onTouchStartFn: handleTouchStartFn,
	};
};
