import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState } from "react";
import { Logo } from "~/app/ui/Logo/Logo";

const contentVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 16,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: "easeOut",
		},
	},
	exit: {
		opacity: 0,
	},
};

export const Route = createFileRoute("/$locale/")({
	ssr: false,
	component() {
		const [showContent, setShowContent] = useState(false);

		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<AnimatePresence mode="wait">
					{!showContent ? (
						<Logo
							onAnimationComplete={() => {
								if (!showContent) {
									setShowContent(true);
								}
							}}
						/>
					) : (
						<motion.div
							key="content"
							variants={contentVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							Some content after the logo animated
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	},
});
