import type { ComponentProps, FC } from "react";
import { uiProgress } from "./uiProgress";

export namespace Progress {
	export interface Props extends uiProgress.Component<ComponentProps<"div">> {
		value: number;
	}
}

export const Progress: FC<Progress.Props> = ({ value, className, ...props }) => {
	return (
		<div
			{...uiProgress({
				className,
			})}
			{...props}
		>
			<div
				data-ui="Progress-progress"
				style={{
					height: "100%",
					lineHeight: 1,
					width: `${Math.max(0, Math.min(100, value))}%`,
				}}
			></div>
		</div>
	);
};
