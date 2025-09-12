import React from "react";
import { createPortal } from "react-dom";

export interface ViewportRectangle {
	x: number; // left in CSS pixels
	y: number; // top in CSS pixels
	width: number; // width in CSS pixels
	height: number; // height in CSS pixels
}

export interface HighlightProperties {
	/** Required: geometry for the hole in viewport coordinates. */
	rect: ViewportRectangle;

	/** Extra padding around the provided rectangle (in pixels). */
	padding?: number;

	/** Backdrop darkness (0..1), applied via giant box-shadow. Default: 0.6 */
	backdropOpacity?: number;

	/** Tailwind classes for the hole visuals (rounded corners, ring, shadow, blur, transitions). */
	holeClassName?: string;

	/** Tailwind classes for the full-screen container (z-index, pointer interactions, print behavior). */
	containerClassName?: string;

	/** Enable transitions after first paint to avoid the initial snap. Default: true */
	animate?: boolean;

	/**
	 * Tailwind transition classes applied to the hole geometry.
	 * Default targets left/top/width/height; respects reduced motion.
	 */
	transitionClassName?: string;

	/** Capture clicks on the dark backdrop. The hole is non-interactive (pointer-events: none). */
	onBackdropClick?: () => void;

	/** Render overlay in a React portal to document.body. Default: true */
	renderInPortal?: boolean;

	/** Z-index for the container. Default: 9999 */
	zIndex?: number;
}

/**
 * Highlight (layout-based)
 * - One overlay <div> with a stylable "hole" child.
 * - Geometry (left, top, width, height) is controlled here; all visuals via holeClassName.
 * - Smooth transitions on geometry to keep rounded corners / shadows visually correct.
 */
export function Highlight({
	rect,
	padding = 8,
	backdropOpacity = 0.6,
	holeClassName = "rounded-2xl ring-2 ring-white/90",
	containerClassName = "print:hidden",
	animate = true,
	transitionClassName = "transition-[left,top,width,height] duration-200 ease-out will-change-[left,top,width,height]",
	onBackdropClick,
	renderInPortal = true,
	zIndex = 9999,
}: HighlightProperties) {
	// Compute padded rectangle for the hole.
	const padded = React.useMemo(() => {
		const x = Math.max(rect.x - padding, 0);
		const y = Math.max(rect.y - padding, 0);
		const width = rect.width + padding * 2;
		const height = rect.height + padding * 2;
		return {
			x,
			y,
			width,
			height,
		};
	}, [
		rect.x,
		rect.y,
		rect.width,
		rect.height,
		padding,
	]);

	// Giant spread shadow dimming the rest of the screen.
	const giantShadow = React.useMemo(
		() => `0 0 0 200vmax rgba(0,0,0,${backdropOpacity})`,
		[
			backdropOpacity,
		],
	);

	// Enable transitions after first paint to prevent the first jump.
	const [transitionsEnabled, setTransitionsEnabled] = React.useState(false);
	React.useEffect(() => {
		if (!animate) return;
		const id = requestAnimationFrame(() => setTransitionsEnabled(true));
		return () => cancelAnimationFrame(id);
	}, [
		animate,
	]);

	const content = (
		<div
			aria-hidden
			className={[
				"fixed inset-0 pointer-events-auto",
				containerClassName,
			].join(" ")}
			style={{
				zIndex,
			}}
			onClick={onBackdropClick}
		>
			<div
				data-highlight-hole
				className={[
					"absolute pointer-events-none",
					animate && transitionsEnabled ? transitionClassName : "",
					holeClassName,
				].join(" ")}
				style={{
					left: padded.x,
					top: padded.y,
					width: padded.width,
					height: padded.height,
					// The dark backdrop is painted by the giant box-shadow around the hole.
					boxShadow: giantShadow,
				}}
			/>
		</div>
	);

	return renderInPortal ? createPortal(content, document.body) : content;
}
