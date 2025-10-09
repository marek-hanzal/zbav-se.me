import { useCls } from "@use-pico/cls";
import type { FC, Ref } from "react";
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

	return (
		<div
			ref={ref}
			className={slots.root()}
		>
			{Array.from({
				length: limit,
			}).map((_, index) => {
				return (
					<Star
						key={`rating-${index + 1}`}
						selected={index + 1 <= value}
						onClick={() => {
							if (allowClear && index + 1 === value) {
								onChange(0);
								return;
							}

							onChange(index + 1);
						}}
					/>
				);
			})}
		</div>
	);
};
