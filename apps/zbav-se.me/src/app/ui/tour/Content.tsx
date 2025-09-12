import {
	FloatingPortal,
	autoUpdate as floatingAutoUpdate,
	flip as floatingFlip,
	offset as floatingOffset,
	shift as floatingShift,
	size as floatingSize,
	limitShift,
	type Placement,
	useFloating,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { type FC, useEffect } from "react";

export namespace Content {
	export interface Props {
		referenceElement: HTMLElement | null;
		placement?: Placement;
		tooltipClassName?: string;
		maxWidthPx?: number;
		margin?: number;
		/** klíč pro přepnutí obsahu (spustí crossfade) */
		contentKey: string | number;
		children: React.ReactNode;
	}
}

/** Floating s plynulým posunem (x/y) a čistým crossfade obsahem; bez animace rozměrů. */
export const Content: FC<Content.Props> = ({
	referenceElement,
	placement = "bottom",
	tooltipClassName = "rounded-2xl bg-white text-neutral-900 shadow-2xl p-4",
	maxWidthPx = 420,
	margin = 16,
	contentKey,
	children,
}) => {
	const { x, y, strategy, refs } = useFloating({
		placement,
		whileElementsMounted: floatingAutoUpdate,
		middleware: [
			floatingOffset(12),
			floatingShift({
				padding: margin,
				limiter: limitShift(),
			}),
			floatingFlip(),
			// jen nasadí limity – žádná animace rozměrů
			floatingSize({
				padding: margin,
				apply({ availableWidth, availableHeight, elements }) {
					const node = elements.floating as HTMLElement;
					const width = Math.min(availableWidth, maxWidthPx);
					const height = Math.max(0, availableHeight);
					Object.assign(node.style, {
						maxWidth: `${width}px`,
						maxHeight: `${height}px`,
						overflow: "auto",
						boxSizing: "border-box",
					});
				},
			}),
		],
	});

	useEffect(() => {
		if (referenceElement) refs.setReference(referenceElement);
	}, [
		referenceElement,
		refs,
	]);

	const tx = Math.round(x ?? 0);
	const ty = Math.round(y ?? 0);

	return (
		<FloatingPortal>
			<motion.div
				ref={refs.setFloating}
				className={[
					tooltipClassName,
					"overflow-auto",
					"max-w-[calc(100dvw-32px)]",
					"max-h-[calc(100dvh-32px)]",
				].join(" ")}
				style={{
					position: strategy, // fixed
					top: 0,
					left: 0,
					zIndex: 10000,
				}}
				// plynulý posun; žádné animace width/height
				animate={{
					x: tx,
					y: ty,
				}}
				transition={{
					duration: 0.35,
					ease: [
						0.22,
						1,
						0.36,
						1,
					],
				}}
				initial={false}
			>
				<AnimatePresence mode="wait">
					<motion.div
						key={contentKey}
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
							duration: 0.25,
						}}
					>
						{children}
					</motion.div>
				</AnimatePresence>
			</motion.div>
		</FloatingPortal>
	);
};
