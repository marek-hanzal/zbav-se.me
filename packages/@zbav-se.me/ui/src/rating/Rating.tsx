import type { useSelection } from "@use-pico/client/hook";
import { TrashIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import { type FC, useId, useMemo } from "react";
import { uiSelectButton } from "../ui";
import { RatingToIcon } from "./RatingToIcon";

function withRatingItems(limit = 6): Rating.RatingItem[] {
	return Array.from(
		{
			length: limit,
		},
		(_, index) => {
			const idx = limit - index;
			return {
				id: String(idx),
			};
		},
	);
}

export namespace Rating {
	export interface RatingItem extends EntitySchema.Type {}

	export interface Props extends Container.Props {
		textHint(value: number): string;
		selection: useSelection.Selection<RatingItem>;
	}
}

export const Rating: FC<Rating.Props> = ({ textHint, selection, ui, ...props }) => {
	const limit = 6;

	const itemId = useId();

	const ratingItems = useMemo<Rating.RatingItem[]>(() => withRatingItems(limit), []);

	return (
		<Container
			data-ui={"Rating-root"}
			ui={{
				scroll: "vertical",
				height: "auto",
				flow: "vertical",
				gap: "lg",
				...ui,
			}}
			{...props}
		>
			{ratingItems.map((item) => {
				const value = Number.parseInt(item.id, 10);
				const icon = RatingToIcon[value as RatingToIcon.Value];
				const selected = selection.isSelected(item.id);

				if (!icon) {
					return null;
				}

				return (
					<Button
						key={`rating-${itemId}-${value}`}
						onClick={() => {
							selection.toggle(item);
						}}
						iconEnabled={icon}
						iconProps={{
							ui: {
								text: "xl",
							},
						}}
						label={textHint(value)}
						{...uiSelectButton({
							isSelected: selected,
							ui: {
								flow: "horizontal",
								justify: "start",
								items: "center",
								gap: "sm",
								size: "default",
								text: "lg",
							},
							className: [],
						})}
					/>
				);
			})}

			<Button
				iconEnabled={TrashIcon}
				label={"Clear all (button)"}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				onClick={() => {
					selection.clear();
				}}
				ui={{
					tone: "warning",
					theme: "light",
					size: "default",
				}}
			/>
		</Container>
	);
};
