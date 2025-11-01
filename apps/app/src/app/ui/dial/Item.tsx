import type { Icon } from "@use-pico/client";
import { Button } from "@use-pico/client/ui/button";
import { anim, useAnim } from "@zbav-se.me/ui";
import { type FC, useRef } from "react";

export namespace Item {
	export interface Props extends Button.Props {
		icon: Icon.Type;
		disabled: boolean;
		onClick(): void;
	}
}

export const Item: FC<Item.Props> = ({ icon, disabled, onClick, ...props }) => {
	const rootRef = useRef<HTMLDivElement>(null);

	const { contextSafe } = useAnim({
		scope: rootRef,
	});

	const onItemClick = contextSafe(() => {
		anim.timeline({
			defaults: {
				duration: 0.15,
			},
		})
			.to(rootRef.current, {
				scale: 1.1,
				y: "-5%",
			})
			.to(rootRef.current, {
				scale: 1,
				y: 0,
			});
	});

	return (
		<Button
			wrapperRef={rootRef}
			iconEnabled={icon}
			disabled={disabled}
			onClick={() => {
				onClick();
				onItemClick();
			}}
			tone={"primary"}
			size={"xl"}
			tweak={{
				slot: {
					wrapper: {
						class: [
							"Dial-Item-root",
							"w-full",
							"h-full",
						],
					},
					root: {
						class: [
							"w-full",
							"h-full",
						],
					},
				},
			}}
			{...props}
		/>
	);
};
