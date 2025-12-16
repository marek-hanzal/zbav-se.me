import { anim, useAnim } from "@use-pico/client/gsap";
import type { Icon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { type FC, useRef } from "react";

export namespace Item {
	export interface Props extends Button.Props {
		icon: Icon.Type;
		disabled: boolean;
		onClick(): void;
	}
}

export const Item: FC<Item.Props> = ({ icon, disabled, onClick, ui, ...props }) => {
	const rootRef = useRef<HTMLButtonElement>(null);

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
			ref={rootRef}
			data-ui={"Item[Button]"}
			iconEnabled={icon}
			iconProps={{
				ui: {
					text: "2xl",
				},
			}}
			disabled={disabled}
			onClick={() => {
				onClick();
				onItemClick();
			}}
			ui={{
				size: "xl",
				items: "center",
				justify: "center",
				height: "full",
				width: "full",
				...ui,
			}}
			{...props}
		/>
	);
};
