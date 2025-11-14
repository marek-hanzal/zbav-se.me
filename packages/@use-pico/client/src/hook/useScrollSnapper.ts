import { type RefObject, useEffect } from "react";

export namespace useScrollSnapper {
	export interface Props {
		scrollerRef: RefObject<HTMLElement | null>;
		pages: number;
	}
}

/**
 * Simple scroll snapper:
 * - listens to scroll events on the scroller
 * - after scrolling stops, snaps to the nearest "page"
 *
 * Assumes each page has the same height as the scroller's clientHeight.
 */
export const useScrollSnapper = ({
	scrollerRef,
	pages,
}: useScrollSnapper.Props) => {
	useEffect(() => {
		const scroller = scrollerRef.current;

		if (!scroller) {
			return;
		}

		if (!Number.isFinite(pages) || pages <= 0) {
			return;
		}

		console.log("Scroll snapper!", pages);

		let isSnapping = false;
		let timeoutId: NodeJS.Timeout | null = null;

		const snapToNearestPage = () => {
			console.log("Snap to nearest page!");

			const viewportHeight = scroller.clientHeight || 1;
			const currentTop = scroller.scrollTop;

			const rawIndex = currentTop / viewportHeight;
			let targetIndex = Math.round(rawIndex);

			if (targetIndex < 0) {
				targetIndex = 0;
			} else if (targetIndex > pages - 1) {
				targetIndex = pages - 1;
			}

			const targetTop = targetIndex * viewportHeight;

			if (Math.abs(targetTop - currentTop) < 2) {
				return;
			}

			isSnapping = true;

			scroller.scrollTo({
				top: targetTop,
				behavior: "smooth",
			});

			setTimeout(() => {
				isSnapping = false;
			}, 300);
		};

		const onScroll = () => {
			console.log("On scroll!", isSnapping);

			if (isSnapping) {
				return;
			}

			console.log("On scroll!");

			if (timeoutId !== null) {
				console.log("Clear timeout!");
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(() => {
				console.log("Timeout!");
				snapToNearestPage();
				timeoutId = null;
			}, 120);
		};

		console.log("Add event listener!", scroller);

		scroller.addEventListener("scroll", onScroll, {
			passive: true,
		});

		return () => {
			if (timeoutId !== null) {
				clearTimeout(timeoutId);
			}
			scroller.removeEventListener("scroll", onScroll);
		};
	}, [
		scrollerRef.current,
		pages,
	]);
};
