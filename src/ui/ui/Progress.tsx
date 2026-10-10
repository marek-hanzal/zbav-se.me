import type { ComponentProps, FC } from "react";
import { uiProgressFn } from "~/ui/fn/uiProgressFn";

export namespace Progress {
	export interface Props extends uiProgressFn.Component<ComponentProps<"div">> {
		value: number;
	}
}

export const Progress: FC<Progress.Props> = ({ value, className, ...props }) => {
	return (
		<div
			{...uiProgressFn({
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
