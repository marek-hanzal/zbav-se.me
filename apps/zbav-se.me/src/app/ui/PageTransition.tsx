import { Outlet, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { type FC, useEffect, useRef } from "react";

export const PageTransition: FC = () => {
	const location = useLocation();

	const mounted = useRef(false);
	useEffect(() => {
		mounted.current = true;
	}, []);

	return (
		<AnimatePresence
			mode="wait"
			initial={false}
		>
			<motion.div
				key={location.href}
				initial={
					mounted.current
						? {
								opacity: 0,
								y: 10,
							}
						: false
				}
				animate={{
					opacity: 1,
					y: 0,
				}}
				exit={{
					opacity: 0,
					y: -10,
				}}
				transition={{
					duration: 0.25,
				}}
			>
				<Outlet />
			</motion.div>
		</AnimatePresence>
	);
};
