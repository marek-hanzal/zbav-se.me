import { Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import { type FC, useRef } from "react";
import { anim, useAnim } from "~/app/ui/gsap";
import { LogoCls } from "./LogoCls";

export namespace Logo {
	export interface Props extends LogoCls.Props {}
}

export const Logo: FC<Logo.Props> = ({ cls = LogoCls, tweak, ...props }) => {
	const { slots } = useCls(cls, tweak);
	const logoRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLDivElement>(null);

	useAnim(
		() => {
			anim.timeline({
				defaults: {
					ease: "none",
				},
			})
				.to(logoRef.current, {
					scale: 1.1,
					opacity: 1,
					rotateZ: 0,
				})
				.add(
					anim
						.to(textRef.current, {
							scale: 1.2,
							opacity: 1,
							rotateZ: 2,
							y: 0,
						})
						.timeScale(2),
				)
				.addLabel("phase-2")
				.to(
					logoRef.current,
					{
						scale: 1,
						rotateZ: -5,
					},
					"phase-2",
				)
				.to(
					textRef.current,
					{
						scale: 1,
						rotateZ: -2,
					},
					"phase-2",
				);
		},
		{
			dependencies: [],
		},
	);

	return (
		<div
			className={slots.root()}
			{...props}
		>
			<div
				ref={logoRef}
				className={slots.logo()}
			>
				<Tx label={"zbav-se.me"} />
			</div>

			<div
				ref={textRef}
				className={slots.text()}
			>
				<Tx
					label="Logo motto (label)"
					tone="secondary"
				/>
			</div>
		</div>
	);
};
