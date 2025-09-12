import {
	FloatingPortal,
	autoUpdate as floatingAutoUpdate,
	flip as floatingFlip,
	limitShift as floatingLimitShift,
	offset as floatingOffset,
	shift as floatingShift,
	size as floatingSize,
	type Placement,
	useFloating,
} from "@floating-ui/react";
import { useEffect } from "react";

export namespace Content {
	export interface Props {
		referenceElement: HTMLElement | null;
		placement?: Placement;
		tooltipClassName?: string;
		maxWidthPx?: number;
		margin?: number;
		children: React.ReactNode;
	}
}

export function Content({
	referenceElement,
	placement = "bottom",
	tooltipClassName = "rounded-2xl bg-white text-neutral-900 shadow-2xl p-4",
	maxWidthPx = 420,
	margin = 16,
	children,
}: Content.Props) {
	const { x, y, strategy, refs } = useFloating({
		placement,
		whileElementsMounted: floatingAutoUpdate,
		middleware: [
			floatingOffset(12),
			floatingShift({
				padding: margin,
				limiter: floatingLimitShift(),
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
		if (referenceElement) {
			refs.setReference(referenceElement);
		}
	}, [
		referenceElement,
		refs,
	]);

	const tx = Math.round(x ?? 0);
	const ty = Math.round(y ?? 0);

	return (
		<FloatingPortal>
			<div
				ref={refs.setFloating}
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
					willChange: "transform",
				}}
			>
				{children}
			</div>
		</FloatingPortal>
	);
}
