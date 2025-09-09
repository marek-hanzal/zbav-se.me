import { useRouterState } from "@tanstack/react-router";
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
			ghostRef.current = outletRef.current?.innerHTML;
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
					}}
					animate={{
						opacity: 1,
					}}
					exit={{
						opacity: 0,
						scale: 0.75,
					}}
					transition={{
						duration: 0.25,
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
						opacity: 0,
						scale: 0.75,
						rotateZ: 30,
					}}
					animate={{
						opacity: 1,
						x: 0,
						y: 0,
						scale: 1,
						rotateZ: 0,
					}}
					transition={{
						duration: 0.25,
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
