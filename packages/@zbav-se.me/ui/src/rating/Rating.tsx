import type { useSelection } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { useCls, VariantProvider } from "@use-pico/cls";
import type { EntitySchema } from "@use-pico/common/schema";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { type FC, type Ref, useId, useMemo } from "react";
import { RatingCls } from "./RatingCls";
import { RatingToIcon } from "./RatingToIcon";

export namespace Rating {
	export interface RatingItem extends EntitySchema.Type {}

	export interface Props extends RatingCls.Props {
		ref?: Ref<HTMLDivElement>;
		textHint(value: number): string;
		selection: useSelection.Selection<RatingItem>;
	}
}

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

export const Rating: FC<Rating.Props> = ({ ref, textHint, selection, cls = RatingCls, tweak }) => {
	const limit = 6;
	const { slots } = useCls(cls, tweak);

	const itemId = useId();

	const ratingItems = useMemo<Rating.RatingItem[]>(() => withRatingItems(limit), []);

	return (
		<Container
			scroll={"vertical"}
			tone={"unset"}
			theme={"unset"}
		>
			<div
				ref={ref}
				className={slots.root()}
			>
				{ratingItems.map((item) => {
					const value = Number.parseInt(item.id, 10);
					const icon = RatingToIcon[value as RatingToIcon.Value];
					const selected = selection.isSelected(item.id);

					if (!icon) {
						return null;
					}

					return (
						<VariantProvider
							key={`rating-${itemId}-${value}`}
							cls={ThemeCls}
							variant={{
								tone: "primary",
								theme: selected ? "dark" : "light",
							}}
						>
							<Button
								size={"xl"}
								full
								tweak={{
									slot: {
										root: {
											class: [
												// "px-4",
												// "py-7",
											],
										},
									},
								}}
							>
								<TypoIcon
									icon={icon}
									onClick={() => {
										selection.toggle(item);
									}}
									iconProps={{
										size: "md",
										tweak: {
											slot: {
												root: {
													class: [
														"Rating-Item-root",
													],
												},
											},
										},
									}}
									tweak={{
										slot: {
											root: {
												class: [
													"justify-start",
													"w-full",
												],
											},
										},
									}}
								>
									<Tx
										label={textHint(value)}
										font={"bold"}
										size={"lg"}
									/>
								</TypoIcon>
							</Button>
						</VariantProvider>
					);
				})}
			</div>
		</Container>
	);
};
