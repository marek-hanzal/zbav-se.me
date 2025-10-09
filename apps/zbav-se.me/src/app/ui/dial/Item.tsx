import { Icon } from "@use-pico/client";
import { type FC, useRef } from "react";
import type { DialCls } from "~/app/ui/dial/DialCls";
import { anim, useAnim } from "~/app/ui/gsap";

export namespace Item {
	export interface Props extends DialCls.Props {
		icon: Icon.Type;
		disabled: boolean;
		onClick(): void;
		slots: DialCls.Slots;
	}
}

export const Item: FC<Item.Props> = ({ icon, disabled, onClick, slots }) => {
	const rootRef = useRef<HTMLDivElement>(null);

	const { contextSafe } = useAnim(
		() => {
			const tl = anim.timeline({
				defaults: {
					duration: 0.25,
				},
			});

			if (disabled) {
				tl.to(rootRef.current, {
					opacity: 0.25,
					scale: 0.75,
				}).to(rootRef.current, {
					opacity: 0.75,
					scale: 1,
				});
				return;
			}

			tl.to(rootRef.current, {
				opacity: 0.75,
				scale: 1.25,
			}).to(rootRef.current, {
				opacity: 1,
				scale: 1,
			});
		},
		{
			dependencies: [
				disabled,
			],
		},
	);

	const onClickSafe = contextSafe(() => {
		onClick();

		anim.timeline({
			defaults: {
				duration: 0.15,
			},
		})
			.to(rootRef.current, {
				opacity: 0.5,
				scale: 0.85,
			})
			.to(rootRef.current, {
				opacity: 1,
				scale: 1,
			});
	});

	return (
		<div
			ref={rootRef}
			className={slots.number({
				variant: {
					disabled,
				},
			})}
			onClick={onClickSafe}
		>
			<Icon
				icon={icon}
				tone={"secondary"}
				theme={"dark"}
			/>
		</div>
	);
};
