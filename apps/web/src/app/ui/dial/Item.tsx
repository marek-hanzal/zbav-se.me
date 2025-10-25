import { Button, type Icon } from "@use-pico/client";
import { type FC, useRef } from "react";
import { anim, useAnim } from "~/app/ui/gsap";

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
				opacity: 0.75,
			})
			.to(rootRef.current, {
				scale: 1,
				opacity: 1,
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
