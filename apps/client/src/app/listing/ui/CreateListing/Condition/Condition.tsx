import { Container, type Icon, Status, Tx } from "@use-pico/client";
import type { FC } from "react";
import { Rating } from "~/app/ui/rating/Rating";

export namespace Condition {
	export interface Props {
		/**
		 * Icon to display (can be a string or component)
		 */
		icon: Icon.Type;
		/**
		 * Translation label for the hint (should include value placeholder)
		 */
		textHint: string;
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
	textHint,
	value,
	onChange,
	limit,
}) => {
	return (
		<Container layout={"vertical-content-footer"}>
			<Status
				icon={icon}
				action={
					<Rating
						value={value}
						limit={limit}
						onChange={onChange}
					/>
				}
			>
				<div className={"text-justify min-h-48 h-48"}>
					<Tx
						label={textHint}
						font={"bold"}
						size={"lg"}
					/>
				</div>
			</Status>
		</Container>
	);
};
