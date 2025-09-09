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

	useLayoutEffect(() => {
		if (status === "pending") {
			ghostRef.current = outletRef.current?.innerHTML;
		} else if (status === "idle") {            
			setTransition("ghost");
		}
	}, [
		status,
	]);

	console.log("transition", {
		status,
		transition,
		ghostRef: ghostRef.current,
	});

	return (
		<AnimatePresence mode="wait">
			{transition === "ghost" ? (
				<>
					Ghost time
					<motion.div
						key={`ghost:${pathname}`}
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
						exit={{
							opacity: 0,
						}}
						transition={{
							duration: 1.5,
							ease: "easeInOut",
						}}
						onAnimationComplete={() => {
							console.log("animation complete");
							setTransition("outlet");
						}}
						dangerouslySetInnerHTML={{
							__html: ghostRef.current ?? "",
						}}
					/>
				</>
			) : null}

			{transition === "outlet" ? (
				<motion.div
					ref={outletRef}
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
			) : null}
		</AnimatePresence>
	);
};
