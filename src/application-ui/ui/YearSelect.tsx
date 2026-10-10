import { type FC, useEffect, useMemo, useRef } from "react";
import { uiSelectButton } from "~/application-ui/fn/uiSelectButton";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import type { useSelection } from "~/selection/hook/useSelection";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";
import type { Nullish } from "~/value/type/Nullish";

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
