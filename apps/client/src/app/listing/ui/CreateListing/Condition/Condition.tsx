import { type Icon, Sheet, Status } from "@use-pico/client";
import type { FC, ReactNode } from "react";
import { Rating } from "~/app/ui/rating/Rating";

export namespace Condition {
	export interface Props {
		/**
		 * Icon to display (can be a string or component)
		 */
		icon: Icon.Type;
		/**
		 * Translation label for the title
		 */
		textTitle: string;
		/**
		 * Translation label for the description
		 */
		textDescription: string;
		/**
		 * Translation label for the hint (should include value placeholder)
		 */
		textHint: ReactNode;
		/**
		 * Current rating value
		 */
		value: number;
		/**
		 * Callback when rating changes
		 */
		onChange: (value: number) => void;
		/**
		 * Maximum rating value (default: 5)
		 */
		limit: number;
	}
}

export const Condition: FC<Condition.Props> = ({
	icon,
	textTitle,
	textDescription,
	textHint,
	value,
	onChange,
	limit,
}) => {
	return (
		<Sheet>
			<Status
				icon={icon}
				textTitle={textTitle}
				textMessage={textDescription}
				tweak={{
					slot: {
						body: {
							class: [
								"flex",
								"flex-col",
								"gap-4",
								"items-center",
								"px-8",
							],
						},
					},
				}}
			>
				<Rating
					value={value}
					limit={limit}
					onChange={onChange}
				/>

				<div className={"text-justify min-h-48 h-48"}>{textHint}</div>
			</Status>
		</Sheet>
	);
};
