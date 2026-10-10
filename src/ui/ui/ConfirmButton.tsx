import React, { type FC, useEffect, useRef, useState } from "react";
import { uiButtonFn } from "~/ui/fn/uiButtonFn";
import { Button } from "~/ui/ui/Button";

export namespace ConfirmButton {
	export interface Props extends Button.Props {
		/**
		 * Props for the initial button state.
		 * These override the base props for the default state.
		 */
		buttonProps?: Partial<Button.Props>;
		/**
		 * Props for the confirmed button state.
		 * These override the base props for the confirm state.
		 */
		confirmProps?: Partial<Button.Props>;
		/**
		 * Timeout in milliseconds before resetting the confirm state.
		 * @default 3000
		 */
		confirmTimeout?: number;
		/**
		 * Callback function to reset the confirm state.
		 */
		onReset?(): void;
	}
}

export const ConfirmButton: FC<ConfirmButton.Props> = ({
	buttonProps,
	confirmProps,
	confirmTimeout = 3000,
	onReset: onResetFn,
	...props
}) => {
	const [isConfirm, setIsConfirmFn] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	const handleClickFn = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (!isConfirm) {
			buttonProps?.onClick?.(event);
			setIsConfirmFn(true);
			timeoutRef.current = setTimeout(() => {
				setIsConfirmFn(false);
				timeoutRef.current = undefined;
				onResetFn?.();
			}, confirmTimeout);
			return;
		}

		clearTimeout(timeoutRef.current);
		timeoutRef.current = undefined;

		setIsConfirmFn(false);

		confirmProps?.onClick?.(event);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const conditionalProps = isConfirm ? confirmProps : buttonProps;

	return (
		<Button
			{...uiButtonFn({
				className: [],
			})}
			{...props}
			{...conditionalProps}
			onClick={handleClickFn}
		/>
	);
};
