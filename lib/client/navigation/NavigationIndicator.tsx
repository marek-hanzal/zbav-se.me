import { useRouterState } from "@tanstack/react-router";
import { type ComponentProps, type FC, useEffect, useState } from "react";
import { uiNavigationIndicator } from "./uiNavigationIndicator";

export namespace NavigationIndicator {
	export interface Props extends uiNavigationIndicator.Component<ComponentProps<"div">> {
		//
	}
}

export const NavigationIndicator: FC<NavigationIndicator.Props> = ({ className, ...props }) => {
	const { status } = useRouterState();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		/**
		 * We don't care about any here, just removed dependency on `NodeJS.Timeout`.
		 */
		let timeout: any | undefined;

		if (status === "pending") {
			timeout = setTimeout(() => {
				setVisible(true);
			}, 50);
		} else {
			setVisible(false);
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
			{...uiNavigationIndicator({
				"data-ui-visible": visible,
				className,
			})}
			{...props}
		/>
	);
};
