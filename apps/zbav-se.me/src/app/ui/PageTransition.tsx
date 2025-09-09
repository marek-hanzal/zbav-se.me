import { Outlet, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";

export function PageTransition() {
	const location = useLocation();

	return (
		<AnimatePresence
			mode="wait"
			initial={false}
		>
			<motion.div
				key={location.pathname}
				initial={{
					opacity: 0,
					x: "25%",
					y: "25%",
					rotateY: 20,
					rotateX: 40,
				}}
				animate={{
					opacity: 1,
					x: 0,
					y: 0,
					rotateY: 0,
					rotateX: 0,
				}}
				exit={{
					opacity: 0,
					x: "-25%",
					y: "-25%",
					transition: {
						duration: 0.15,
					},
				}}
				transition={{
					duration: 0.15,
					ease: "easeInOut",
				}}
			>
				<Outlet />
			</motion.div>
		</AnimatePresence>
	);
}
