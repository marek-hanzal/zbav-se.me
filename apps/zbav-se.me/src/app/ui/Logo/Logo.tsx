import { Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import { type MotionProps, motion, type Variants } from "motion/react";
import type { FC } from "react";
import { LogoCls } from "~/app/ui/logo/LogoCls";

const variants = {
	root: {
		hidden: {},
		visible: {
			transition: {
				delayChildren: 1.25,
				when: "afterChildren",
			},
		},
		exit: {
			opacity: 0,
			scale: 0.9,
			transition: {
				duration: 0.25,
			},
		},
	} as const satisfies Variants,

	logo: {
		hidden: {
			opacity: 0,
			scale: 0.5,
		},
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.6,
				ease: "easeOut",
				type: "spring",
				stiffness: 100,
			},
		},
	} as const satisfies Variants,

	text: {
		hidden: {
			opacity: 0,
			rotate: -8,
			scale: 0.6,
		},
		visible: {
			opacity: 1,
			rotate: -3,
			scale: 1,
			y: -8,
			transition: {
				duration: 0.8,
				delay: 0.3,
				ease: "easeOut",
				type: "spring",
				stiffness: 80,
			},
		},
	} as const satisfies Variants,
} as const;

export namespace Logo {
	export interface Props extends LogoCls.Props<MotionProps> {}
}

export const Logo: FC<Logo.Props> = ({ cls = LogoCls, tweak, ...props }) => {
	const slots = useCls(cls, tweak);

	return (
		<motion.div
			className={slots.root()}
			variants={variants.root}
			initial="hidden"
			animate="visible"
			exit="exit"
			{...props}
		>
			<motion.div
				className={slots.logo()}
				variants={variants.logo}
			>
				zbav-se.me
			</motion.div>

			<motion.div
				className={slots.text()}
				variants={variants.text}
			>
				<Tx label="Prostě to pošli dál..." />
			</motion.div>
		</motion.div>
	);
};
