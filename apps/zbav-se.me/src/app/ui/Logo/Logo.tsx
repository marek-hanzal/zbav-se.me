import { Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import { motion } from "motion/react";
import type { FC } from "react";
import { LogoCls } from "~/app/ui/Logo/LogoCls";

export namespace Logo {
	export interface Props extends LogoCls.Props {}
}

export const Logo: FC<Logo.Props> = ({ cls = LogoCls, tweak }) => {
	const slots = useCls(cls, tweak);

	return (
		<div className={slots.root()}>
			<motion.div
				className={slots.logo()}
				initial={{
					opacity: 0,
					scale: 0.5,
				}}
				animate={{
					opacity: 1,
					scale: 1,
				}}
				transition={{
					duration: 0.6,
					ease: "easeOut",
					type: "spring",
					stiffness: 100,
				}}
			>
				zbav-se.me
			</motion.div>

			<motion.div
				className={slots.text()}
				initial={{
					opacity: 0,
					rotate: -8,
					scale: 0.6,
				}}
				animate={{
					opacity: 1,
					rotate: -3,
					scale: 1,
					y: -8,
				}}
				transition={{
					duration: 0.8,
					delay: 0.3,
					ease: "easeOut",
					type: "spring",
					stiffness: 80,
				}}
			>
				<Tx label={"Pošli do světa co je již netřeba"} />
			</motion.div>
		</div>
	);
};
