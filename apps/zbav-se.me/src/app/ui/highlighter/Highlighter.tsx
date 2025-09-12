import type { FC } from "react";

export namespace Highlighter {
	export interface Props {
		/** Viewport-relative rectangle of the target element */
		rect: {
			x: number;
			y: number;
			width: number;
			height: number;
		};
		/** Extra padding expanded around the rectangle */
		padding?: number;
		/** Tailwind (or custom) classes applied to the hole element (rounded, ring, blur…) */
		holeClassName?: string;
		/** Classes for the full-screen overlay container (z-index, print rules…) */
		containerClassName?: string;
		/** Backdrop darkness 0..1 applied via giant box-shadow */
		backdropOpacity?: number;
		/** Called when user clicks the backdrop (including the hole; hole is not click-through) */
		onBackdropClick?: () => void;
	}
}

export const Highlighter: FC<Highlighter.Props> = ({
	rect,
	padding = 8,
	holeClassName = "rounded-2xl ring-2 ring-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
	containerClassName = "print:hidden",
	backdropOpacity = 0.6,
	onBackdropClick,
}) => {
	// Compute the hole box expanded by ¬padding
	const x = Math.max(0, Math.floor(rect.x - padding));
	const y = Math.max(0, Math.floor(rect.y - padding));
	const width = Math.ceil(rect.width + padding * 2);
	const height = Math.ceil(rect.height + padding * 2);

	return (
		<div
			className={containerClassName}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 9999,
				pointerEvents: "auto",
			}}
			onClick={onBackdropClick}
		>
			<div
				className={holeClassName}
				style={{
					position: "fixed",
					top: y,
					left: x,
					width,
					height,
					boxShadow: `0 0 0 9999px rgba(0,0,0,${backdropOpacity})`,
					transition:
						"top 300ms ease, left 300ms ease, width 300ms ease, height 300ms ease",
				}}
			/>
		</div>
	);
};
