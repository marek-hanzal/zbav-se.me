import { Container, type Icon, Status } from "@use-pico/client";
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
		textTitle: ReactNode;
		/**
		 * Translation label for the description
		 */
		textDescription: ReactNode;
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
		<Container
			tone={"primary"}
			theme={"light"}
			border={"sm"}
			square={"md"}
		>
			<Status
				icon={icon}
				textTitle={textTitle}
				textMessage={textDescription}
			>
				<Rating
					value={value}
					limit={limit}
					onChange={onChange}
				/>
			</Status>

			<div className={"p-4 text-justify"}>{textHint}</div>
		</Container>
	);
};
