import { useCls } from "@use-pico/cls";
import {
	type FC,
	type Ref,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { anim, useAnim } from "~/app/ui/gsap";
import { RatingCls } from "~/app/ui/rating/RatingCls";
import { Star } from "~/app/ui/rating/Star";

export namespace Rating {
	export interface Props extends RatingCls.Props {
		ref?: Ref<HTMLDivElement>;
		value: number;
		limit: number;
		allowClear?: boolean;
		onChange: (value: number) => void;
	}
}

export const Rating: FC<Rating.Props> = ({
	ref,
	value,
	limit,
	allowClear = true,
	onChange,
	cls = RatingCls,
	tweak,
}) => {
	const { slots } = useCls(cls, tweak);

	const innerRef = useRef<HTMLDivElement>(null);

	// Visual value lags the real value and flips at mid-animation
	const [visualValue, setVisualValue] = useState<number>(value);
	// biome-ignore lint/correctness/useExhaustiveDependencies: We're good
	useEffect(() => {
		// keep in sync on mount/external programmatic changes
		setVisualValue((v) => (v !== value ? v : value));
	}, []); // only on mount

	const prevValueRef = useRef<number>(value);
	const clampedValue = useMemo(
		() => Math.max(0, Math.min(limit, value)),
		[
			value,
			limit,
		],
	);

	useAnim(
		() => {
			const prev = prevValueRef.current;
			const next = clampedValue;
			if (prev === next) {
				return;
			}

			const stars = anim.utils.toArray(".Star-root");
			const low = Math.min(prev, next);
			const high = Math.max(prev, next);
			const affected = stars.slice(low, high);
			const items = prev < next ? affected : affected.slice().reverse();

			const tl = anim.timeline({
				defaults: {
					duration: 0.15,
					ease: "power2.out",
				},
			});

			// Phase 1: nudge & pop (before selected flips)
			tl.to(items, {
				scale: prev < next ? 1.25 : 0.75,
				opacity: 0,
				stagger: 0.035,
			});

			// MIDPOINT: now flip which stars are "selected"
			tl.call(() => {
				setVisualValue(next);
			});

			// Phase 2: settle
			tl.to(items, {
				opacity: 1,
				scale: 1,
				stagger: 0.035,
			});

			// Store next for direction on future runs
			tl.call(() => {
				prevValueRef.current = next;
			});
		},
		{
			scope: innerRef,
			dependencies: [
				clampedValue,
				limit,
			],
		},
	);

	const starId = useId();

	return (
		<div
			ref={ref}
			className={slots.root()}
		>
			<div ref={innerRef}>
				{Array.from({
					length: limit,
				}).map((_, index) => {
					const idx = index + 1;
					return (
						<Star
							key={`rating-${starId}-${idx}`}
							selected={idx <= visualValue}
							onClick={() => {
								if (allowClear && idx === clampedValue) {
									onChange(0);
								} else {
									onChange(idx);
								}
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};
