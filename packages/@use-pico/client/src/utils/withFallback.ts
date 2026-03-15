import type { ComponentType } from "react";

export const withFallback = <const TProps, const TFallback extends ComponentType<any>>(
	Component: ComponentType<TProps>,
	Fallback: TFallback,
) => {
	return Object.assign(Component, {
		Fallback,
	});
};
