import type { FC } from "react";
import { Rating } from "~/app/ui/rating/Rating";

export namespace Condition {
	export interface Props {
		/**
		 * Translation label for the hint (should include value placeholder)
		 */
		textHint(value: number): string;
		/**
		 * Current rating value
		 */
		value: number;
		/**
		 * Callback when rating changes
		 */
		onChange: (value: number) => void;
	}
}

export const Condition: FC<Condition.Props> = ({
	textHint,
	value,
	onChange,
}) => {
	return (
		<div
			className={
				"grid grid-rows-1 justify-stretch items-center w-full h-full"
			}
		>
			<Rating
				textHint={textHint}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};
