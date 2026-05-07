import type { ComponentType } from "react";

/**
 * Attaches a static `Fallback` component to a render component so both can travel together
 * as a single export.
 *
 * This is mainly useful for `Suspense`-driven components that fetch their data internally and
 * should expose the loading UI next to the component itself:
 *
 * ```tsx
 * const FeedList = withFallback(FeedListView, SpinnerContainer);
 *
 * <Suspense fallback={<FeedList.Fallback />}>
 * 	<FeedList />
 * </Suspense>
 * ```
 *
 * The original component instance is returned unchanged, only extended with a `Fallback`
 * property. That keeps the component callable as usual while giving consumers a colocated,
 * type-safe fallback entry point.
 */
export const withFallback = <const TProps, const TFallback extends ComponentType<any>>(
	Component: ComponentType<TProps>,
	Fallback: TFallback,
): ComponentType<TProps> & {
	Fallback: TFallback;
} => {
	return Object.assign(Component, {
		Fallback,
	});
};
