import { type FC, useEffect, useMemo, useRef } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import type { useSelection } from "@/lib/client/selection";
import type { EntitySchema } from "@/lib/common/schema";
import type { Nullish } from "@/lib/common/type";
import { uiSelectButton } from "../ui/uiSelectButton";

export namespace YearSelect {
	export interface Props extends Container.Props {
		from: Nullish<number>;
		to: Nullish<number>;
		selection: useSelection.Use<EntitySchema.Type>;
	}
}

export const YearSelect: FC<YearSelect.Props> = ({ from, to, selection }) => {
	const min = Math.max(from ?? 1940, 1940);
	const max = Math.max(min, Math.min(to ?? 2099, 2099));
	const years = useMemo(() => {
		return Array.from(
			{
				length: max - min + 1,
			},
			(_, index) => min + index,
		);
	}, [
		max,
		min,
	]);

	const selectedYear = selection.optional.singleId();
	const scrollRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		scrollRef.current
			?.querySelector<HTMLElement>(`[data-selected-year="${selectedYear ?? ""}"]`)
			?.scrollIntoView({
				block: "center",
				inline: "center",
				behavior: "smooth",
			});
	}, [
		selectedYear,
	]);

	return (
		<Container
			data-ui={"YearSelect"}
			data-ui-height="full"
			data-ui-scroll="vertical"
			ref={scrollRef}
		>
			<div
				className={[
					"grid",
					"grid-cols-3",
					"gap-3",
				].join(" ")}
			>
				{years.map((year) => {
					const value = String(year);
					const selected = selection.isSelected(value);

					return (
						<Button
							key={value}
							data-selected-year={selected ? value : undefined}
							onClick={() => {
								selection.toggle({
									id: value,
								});
							}}
							{...uiSelectButton({
								isSelected: selected,
								"data-ui-size": "default",
								"data-ui-justify": "center",
								"data-ui-items": "center",
								"data-ui-text": "lg",
								className: [
									"min-h-14",
								],
							})}
						>
							{value}
						</Button>
					);
				})}
			</div>
		</Container>
	);
};
