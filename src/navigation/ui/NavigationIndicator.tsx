import { useRouterState } from "@tanstack/react-router";
import { type ComponentProps, type FC, useEffect, useState } from "react";
import { uiNavigationIndicatorFn } from "~/navigation/fn/uiNavigationIndicatorFn";

export namespace NavigationIndicator {
	export interface Props extends uiNavigationIndicatorFn.Component<ComponentProps<"div">> {
		//
	}
}

export const NavigationIndicator: FC<NavigationIndicator.Props> = ({ className, ...props }) => {
	const { status } = useRouterState();
	const [visible, setVisibleFn] = useState(false);

	useEffect(() => {
		/**
		 * We don't care about any here, just removed dependency on `NodeJS.Timeout`.
		 */
		let timeout: any | undefined;

		if (status === "pending") {
			timeout = setTimeout(() => {
				setVisibleFn(true);
			}, 50);
		} else {
			setVisibleFn(false);
			clearTimeout(timeout);
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [
		status,
	]);

	return (
		<div
			{...uiNavigationIndicatorFn({
				"data-ui-visible": visible,
				className,
			})}
			{...props}
		/>
	);
};
