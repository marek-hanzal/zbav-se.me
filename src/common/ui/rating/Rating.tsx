import { type FC, useMemo } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { TrashIcon } from "@/lib/client/icon";
import type { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { EntitySchema } from "@/lib/common/schema";
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
		textRatingFn?(rating: RatingToIcon.Value): string;
		textHintFn?(rating: RatingToIcon.Value): string;
		selection: useSelection.Selection<RatingItem>;
		allowClear?: boolean;
	}
}

export const Rating: FC<Rating.Props> = ({
	textRatingFn,
	textHintFn,
	selection,
	allowClear = false,
	ui,
	...props
}) => {
	const limit = 6;

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
				const value = Number.parseInt(item.id, 10) as RatingToIcon.Value;
				const icon = RatingToIcon[value];
				const selected = selection.isSelected(item.id);

				if (!icon) {
					return null;
				}

				return (
					<Button
						key={value}
						onClick={() => {
							selection.toggle(item);
						}}
						iconEnabled={icon}
						iconProps={{
							ui: {
								text: "2xl",
								color: selected ? "lead" : "icon",
							},
						}}
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
							className: [
								"text-left",
								"shrink-0",
							],
						})}
					>
						<Container
							data-ui-flow="vertical"
							data-ui-items="start"
						>
							<Tx
								label={textRatingFn?.(value)}
								data-ui-display="block"
							/>
							<Tx
								label={textHintFn?.(value)}
								data-ui-display="block"
								data-ui-text="sm"
								data-ui-opacity="6"
							/>
						</Container>
					</Button>
				);
			})}

			{allowClear ? (
				<Button
					iconEnabled={TrashIcon}
					iconProps={{
						"data-ui-text": "xl",
					}}
					onClick={() => {
						selection.clear();
					}}
					ui={{
						tone: "warning",
						theme: "light",
						size: "default",
					}}
				>
					<Tx label={"Clear all (button)"} />
				</Button>
			) : null}
		</Container>
	);
};
