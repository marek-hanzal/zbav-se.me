import { useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import type { FC, PropsWithChildren } from "react";

export const PageTransition: FC<PropsWithChildren> = ({ children }) => {
	const { pathname } = useLocation();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				initial={{
					opacity: 0,
					// x: "25%",
					// y: "-25%",
					// rotateY: 80,
					rotateZ: 30,
				}}
				animate={{
					opacity: 1,
					x: 0,
					y: 0,
					rotateY: 0,
					rotateX: 0,
					rotateZ: 0,
				}}
				exit={{
					opacity: 0,
					// x: "-25%",
					// y: "-25%",
					rotateZ: 30,
				}}
				transition={{
					duration: 1.5,
					ease: "easeInOut",
				}}
				className="w-full h-full"
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};
