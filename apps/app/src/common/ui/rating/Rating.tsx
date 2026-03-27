import { TrashIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import { type FC, useMemo } from "react";
import type { useSelection } from "@/lib/client/selection";
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
							ui={{
								flow: "vertical",
								items: "start",
							}}
						>
							<Tx
								label={textRatingFn?.(value)}
								ui={{
									display: "block",
								}}
							/>
							<Tx
								label={textHintFn?.(value)}
								ui={{
									display: "block",
									text: "sm",
									opacity: "6",
								}}
							/>
						</Container>
					</Button>
				);
			})}

			{allowClear ? (
				<Button
					iconEnabled={TrashIcon}
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
				>
					<Tx label={"Clear all (button)"} />
				</Button>
			) : null}
		</Container>
	);
};
