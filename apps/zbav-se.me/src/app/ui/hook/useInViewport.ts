import { useEffect, useState } from "react";

/** Observe whether an element is in the (visual) viewport. */
export function useInViewport(
	element: HTMLElement | null,
	{
		threshold = 1, // 1 = fully visible; 0 = partially visible
		rootMargin = "0px", // e.g. "50px 0px 50px 0px" for early detection
	}: {
		threshold?: number;
		rootMargin?: string;
	} = {},
) {
	const [inView, setInView] = useState(false);

	useEffect(() => {
		if (!element) {
			setInView(false);
			return;
		}

		// Prefer visualViewport bounds if available (mobile URL bar shenanigans)
		const root: Element | null = null;
		const observer = new IntersectionObserver(
			(entries) => {
				// if multiple entries, pick the one for our element
				const entry =
					entries.find((e) => e.target === element) ?? entries[0];
				setInView(
					Boolean(
						entry?.isIntersecting &&
							entry.intersectionRatio >= threshold,
					),
				);
			},
			{
				root,
				rootMargin,
				threshold,
			}, // threshold can be number or array; here number is fine
		);

		observer.observe(element);
		return () => {
			observer.disconnect();
		};
	}, [
		element,
		threshold,
		rootMargin,
	]);

	return inView;
}
