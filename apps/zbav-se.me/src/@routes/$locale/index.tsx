import { createFileRoute } from "@tanstack/react-router";
import { Button, LinkTo, Tx } from "@use-pico/client";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState } from "react";
import { Logo } from "~/app/ui/Logo/Logo";
import { PageTransition } from "~/app/ui/PageTransition";

const contentVariants = {
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
} as const satisfies Variants;

export const Route = createFileRoute("/$locale/")({
	component() {
		const { locale } = Route.useParams();
		const [intro, setIntro] = useState(true);

		return (
			<div className="h-screen w-screen">
				<AnimatePresence mode="wait">
					{intro ? (
						<div className="flex h-full flex-col items-center justify-center">
							<Logo
								onAnimationComplete={() => {
									if (intro) {
										setIntro(false);
									}
								}}
							/>
						</div>
					) : (
						<motion.div
							key="content"
							variants={contentVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							className="flex h-full w-full flex-col items-center justify-center"
						>
							<div className="flex flex-col w-full gap-4 p-4">
								<LinkTo
									to={"/$locale/order/supply/create"}
									params={{
										locale,
									}}
								>
									<Button
										size="xl"
										tone="primary"
										theme="dark"
										tweak={({ what }) => ({
											slot: what.slot({
												root: what.css([
													"w-full",
												]),
											}),
										})}
									>
										<Tx label={"Nabídnout"} />
									</Button>
								</LinkTo>

								<LinkTo
									to={"/$locale/order/demand/create"}
									params={{
										locale,
									}}
								>
									<Button
										size="xl"
										tone="secondary"
										theme="dark"
										tweak={({ what }) => ({
											slot: what.slot({
												root: what.css([
													"w-full",
												]),
											}),
										})}
									>
										<Tx label={"Poptat"} />
									</Button>
								</LinkTo>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	},
});
