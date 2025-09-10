import { useRouterState } from "@tanstack/react-router";
import { deepHtml } from "@use-pico/client";
import { AnimatePresence, motion } from "motion/react";
import {
    type FC,
    type PropsWithChildren,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

export const PageTransition: FC<PropsWithChildren> = ({ children }) => {
	const { pathname, status } = useRouterState({
		select: (state) => ({
			pathname: state.location.pathname,
			status: state.status,
		}),
	});
	const [transition, setTransition] = useState<"ghost" | "outlet">("outlet");

	const outletRef = useRef<HTMLDivElement>(null);
	const ghostRef = useRef<string | undefined>(undefined);
	const readyRef = useRef(false);

	useLayoutEffect(() => {
		if (status === "idle") {
			readyRef.current = true;
		}
		if (status === "pending" && readyRef.current) {
			if (outletRef.current) {
				ghostRef.current = deepHtml(outletRef.current).innerHTML;
			}
			setTransition("ghost");
		}
	}, [
		status,
	]);

	return (
		<AnimatePresence
			mode="wait"
			initial={false}
		>
			{transition === "ghost" ? (
				<motion.div
					key={`ghost:${pathname}`}
					initial={{
						opacity: 1,
						scale: 1,
					}}
					animate={{
						opacity: 1,
						scale: 1,
					}}
					exit={{
						opacity: 0.25,
						x: "-25%",
						scale: 1,
					}}
					transition={{
						duration: 0.1,
						ease: "easeInOut",
					}}
					onAnimationComplete={() => {
						setTransition("outlet");
						ghostRef.current = undefined;
					}}
					dangerouslySetInnerHTML={{
						__html: ghostRef.current ?? "",
					}}
					className="w-full h-full"
				/>
			) : null}

			{transition === "outlet" ? (
				<motion.div
					ref={outletRef}
					key={`${status}-${pathname}`}
					initial={{
						opacity: 0.25,
						scale: 1,
						x: "25%",
					}}
					animate={{
						opacity: 1,
						x: 0,
						y: 0,
						scale: 1,
					}}
					transition={{
						duration: 0.1,
						ease: "easeInOut",
					}}
					className="w-full h-full"
				>
					{children}
				</motion.div>
			) : null}
		</AnimatePresence>
	);
};
