import { Icon } from "@use-pico/client";
import { type FC, useRef, useState } from "react";
import { anim, useAnim } from "~/app/ui/gsap";
import { StarEmptyIcon } from "~/app/ui/icon/StarEmptyIcon";
import { StarIcon } from "~/app/ui/icon/StarIcon";

export namespace Star {
	export interface Props {
		selected: boolean;
		onClick: () => void;
	}
}

export const Star: FC<Star.Props> = ({ selected, onClick }) => {
	const iconRef = useRef<HTMLDivElement>(null);
	const [icon, setIcon] = useState<string>(
		selected ? StarIcon : StarEmptyIcon,
	);

	useAnim(
		() => {
			anim.timeline({
				defaults: {
					duration: 0.2,
				},
			})
				.to(iconRef.current, {
					rotateZ: 45,
					opacity: 0,
					scale: 0.75,
					onComplete() {
						setIcon(selected ? StarIcon : StarEmptyIcon);
					},
				})
				.to(
					iconRef.current,
					selected
						? {
								rotateZ: 0,
								opacity: 1,
								scale: 1,
							}
						: {
								rotateZ: 0,
								opacity: 0.75,
								scale: 0.75,
							},
				);
		},
		{
			dependencies: [
				selected,
			],
		},
	);

	return (
		<Icon
			ref={iconRef}
			icon={icon}
			onClick={onClick}
			tone={"secondary"}
			theme={"light"}
			size={"xl"}
		/>
	);
};
