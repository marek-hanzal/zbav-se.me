import { Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import { type MotionProps, motion, type Variants } from "motion/react";
import type { FC } from "react";
import { useState } from "react";
import { LogoCls } from "~/app/ui/LogoCls";

const variants = {
	root: {
		hidden: {},
		visible: {},
		exit: {
			opacity: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
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
				delay: 0,
			},
		},
		looped: {
			opacity: 1,
			scale: 1,
			rotate: [
				0,
				5,
				-5,
				0,
			],
			transition: {
				opacity: {
					duration: 0.5,
					repeat: Infinity,
					repeatType: "loop",
				},
				scale: {
					duration: 2.5,
					ease: "easeInOut",
					repeat: Infinity,
					repeatType: "loop",
				},
				rotate: {
					duration: 2.5,
					ease: "easeInOut",
					repeat: Infinity,
					repeatType: "loop",
				},
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
				delay: 1.25,
				ease: "easeOut",
				type: "spring",
				stiffness: 80,
			},
		},
		looped: {
			opacity: 1,
			rotate: -3,
			scale: 1,
			y: [
				-8,
				-12,
				-8,
			],
			transition: {
				opacity: {
					duration: 0,
					repeat: Infinity,
					repeatType: "loop",
				},
				rotate: {
					duration: 0,
					repeat: Infinity,
					repeatType: "loop",
				},
				scale: {
					duration: 0,
					repeat: Infinity,
					repeatType: "loop",
				},
				y: {
					duration: 2.5,
					ease: "easeInOut",
					repeat: Infinity,
					repeatType: "loop",
				},
			},
		},
	} as const satisfies Variants,
} as const;

export namespace LogoAnimated {
	export interface Props extends LogoCls.Props<MotionProps> {
		/** Whether to enable the looped animation after initial enter animation */
		loop?: boolean;
	}
}

export const LogoAnimated: FC<LogoAnimated.Props> = ({
	cls = LogoCls,
	tweak,
	loop = true,
	...props
}) => {
	const { slots } = useCls(cls, tweak);
	const [animationState, setAnimationState] = useState<"visible" | "looped">(
		loop ? "looped" : "visible",
	);

	const handleLogoAnimationComplete = (definition: string) => {
		if (definition === "visible" && loop) {
			setAnimationState("looped");
		}
	};

	const handleTextAnimationComplete = (definition: string) => {
		if (definition === "visible" && loop) {
			// Text animation completes slightly after logo, so we can also trigger the loop here
			// or just let the logo animation handle it
		}
	};

	return (
		<motion.div
			className={slots.root()}
			variants={variants.root}
			initial="hidden"
			animate="visible"
			exit="exit"
			transition={{
				delay: 0,
			}}
			{...props}
		>
			<motion.div
				className={slots.logo()}
				variants={variants.logo}
				animate={animationState}
				onAnimationComplete={handleLogoAnimationComplete}
			>
				zbav-se.me
			</motion.div>

			<motion.div
				className={slots.text()}
				variants={variants.text}
				animate={animationState}
				onAnimationComplete={handleTextAnimationComplete}
			>
				<Tx label="Prostě to pošli dál..." />
			</motion.div>
		</motion.div>
	);
};
