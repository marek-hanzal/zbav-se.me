import { Button, Tx } from "@use-pico/client";
import { useCls, VariantProvider } from "@use-pico/cls";
import { type FC, type Ref, useId } from "react";
import { RatingCls } from "~/app/ui/rating/RatingCls";
import { RatingToIcon } from "~/app/ui/rating/RatingToIcon";
import { ThemeCls } from "~/app/ui/ThemeCls";
import { TypoIcon } from "~/app/ui/text/TypoIcon";

export namespace Rating {
	export interface Props extends RatingCls.Props {
		ref?: Ref<HTMLDivElement>;
		textHint(value: number): string;
		allowClear?: boolean;
		value: number;
		onChange(value: number): void;
	}
}

export const Rating: FC<Rating.Props> = ({
	ref,
	textHint,
	allowClear = true,
	value,
	onChange,
	cls = RatingCls,
	tweak,
}) => {
	const limit = 6;
	const { slots } = useCls(cls, tweak);

	const itemId = useId();

	return (
		<div
			ref={ref}
			className={slots.root()}
		>
			{Array.from({
				length: limit,
			}).map((_, index) => {
				const idx = limit - index;
				const icon = RatingToIcon[idx as RatingToIcon.Value];
				const selected = idx === value;

				if (!icon) {
					return null;
				}

				return (
					<VariantProvider
						key={`rating-${itemId}-${idx}`}
						cls={ThemeCls}
						variant={{
							tone: "primary",
							theme: selected ? "dark" : "light",
						}}
					>
						<Button
							size={"lg"}
							full
							tweak={{
								slot: {
									root: {
										class: [
											"px-4",
											"py-8",
										],
									},
								},
							}}
						>
							<TypoIcon
								icon={icon}
								onClick={() => {
									if (allowClear && idx === value) {
										onChange(0);
										return;
									}

									onChange(idx);
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
									label={textHint(idx)}
									font={"bold"}
									size={"lg"}
								/>
							</TypoIcon>
						</Button>
					</VariantProvider>
				);
			})}
		</div>
	);
};
