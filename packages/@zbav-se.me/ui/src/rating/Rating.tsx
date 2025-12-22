import type { useSelection } from "@use-pico/client/hook";
import { TrashIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import { type FC, type ReactNode, useMemo } from "react";
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
		renderPrefix?(): ReactNode;
		renderSuffix?(): ReactNode;
		selection: useSelection.Selection<RatingItem>;
		allowClear?: boolean;
	}
}

export const Rating: FC<Rating.Props> = ({
	renderPrefix,
	renderSuffix,
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
			{renderPrefix?.()}

			{ratingItems.map((item) => {
				const value = Number.parseInt(item.id, 10);
				const icon = RatingToIcon[value as RatingToIcon.Value];
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
								text: "3xl",
							},
						}}
						{...uiSelectButton({
							isSelected: selected,
							ui: {
								flow: "horizontal",
								justify: "center",
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

			{renderSuffix?.()}

			{allowClear ? (
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
			) : null}
		</Container>
	);
};
