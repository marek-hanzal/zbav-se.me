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
import type React from "react";
import { type FC, useEffect, useMemo, useRef, useState } from "react";

export namespace Content {
	export interface Props {
		referenceElement: HTMLElement | null;
		placement?: Placement;
		tooltipClassName?: string;
		maxWidthPx?: number;
		margin?: number;
		contentKey: string | number;
		fadeDurationMs?: number;
		children: React.ReactNode;
	}
}

export const Content: FC<Content.Props> = ({
	referenceElement,
	placement = "bottom",
	tooltipClassName = "rounded-2xl bg-white text-neutral-900 shadow-2xl p-4",
	maxWidthPx = 420,
	margin = 16,
	contentKey,
	fadeDurationMs = 250,
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

	/* ————————— Fade orchestrator ————————— */
	const [opacity, setOpacity] = useState(1);
	const [stagedKey, setStagedKey] = useState(contentKey);
	const [stagedChildren, setStagedChildren] = useState(children);
	const outerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (contentKey === stagedKey) {
			// same key → just update children without animation
			setStagedChildren(children);
			return;
		}
		// start fade-out
		setOpacity(0);

		const node = outerRef.current;
		if (!node) return;

		const handleEnd = (e: TransitionEvent) => {
			if (e.propertyName !== "opacity") return;
			// swap to new content
			setStagedKey(contentKey);
			setStagedChildren(children);
			// fade back in on next frame
			requestAnimationFrame(() => setOpacity(1));
		};
		node.addEventListener("transitionend", handleEnd);

		return () => {
			node.removeEventListener("transitionend", handleEnd);
		};
	}, [
		contentKey,
		children,
		stagedKey,
	]);

	const crossFadeStyle: React.CSSProperties = useMemo(
		() => ({
			opacity,
			transition: `opacity ${fadeDurationMs}ms ease`,
		}),
		[
			opacity,
			fadeDurationMs,
		],
	);

	return (
		<FloatingPortal>
			<div
				ref={(el) => {
					outerRef.current = el;
					refs.setFloating(el);
				}}
				className={[
					tooltipClassName,
					"overflow-auto",
					"max-w-[calc(100dvw-32px)]",
					"max-h-[calc(100dvh-32px)]",
				].join(" ")}
				style={{
					position: strategy,
					top: 0,
					left: 0,
					transform: `translate3d(${tx}px, ${ty}px, 0)`,
					zIndex: 10000,
					willChange: "transform,opacity",
					...crossFadeStyle,
				}}
			>
				{stagedChildren}
			</div>
		</FloatingPortal>
	);
};
