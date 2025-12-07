import { TrashIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { tvc } from "@use-pico/cls";
import type { tListingSort, tListingSortField } from "@zbav-se.me/sdk/api/user";
import { type FC, useId } from "react";

export namespace ListingSortSelect {
	export interface Props extends Container.Props {
		withGeo: boolean | undefined;
		value: tListingSort[];
		onChange(sort: (prev: tListingSort[]) => tListingSort[]): void;
	}
}

export const ListingSortSelect: FC<ListingSortSelect.Props> = ({
	withGeo,
	value,
	onChange,
	...props
}) => {
	const sortKeyId = useId();

	return (
		<Container
			data-ui={"ListingSortSelect"}
			layout={"vertical-flex"}
			scroll={"vertical"}
			gap={"sm"}
			height={"auto"}
			width={"full"}
			{...props}
		>
			{(
				(
					[
						"age",
						"price",
						"condition",
						withGeo ? "geo" : undefined,
					] satisfies (tListingSortField | undefined)[]
				).filter(Boolean) as tListingSortField[]
			).map((sortValue) => {
				const current = value.find((s) => s.field === sortValue);

				const position = current
					? value.findIndex((s) => s.field === sortValue) + 1
					: undefined;

				return (
					<Button
						key={`${sortKeyId}-${sortValue}`}
						size={"xl"}
						className={tvc([
							"justify-start",
							"text-left",
							"py-2",
							"px-3",
							"h-18",
						])}
						full
						onClick={() => {
							onChange((prev) => {
								const idx = prev.findIndex((s) => s.field === sortValue);

								if (idx < 0) {
									return [
										...prev,
										{
											field: sortValue,
											direction: "asc",
										} satisfies tListingSort,
									];
								}

								const cur = prev[idx];

								if (!cur || cur.field !== sortValue) {
									return prev;
								}

								if (cur.direction === "asc") {
									const next = [
										...prev,
									];
									next[idx] = {
										field: cur.field,
										direction: "desc",
									} satisfies tListingSort;
									return next;
								}

								return prev.filter((_, i) => i !== idx);
							});
						}}
					>
						<div className="flex gap-2 items-center justify-between w-full">
							<Tx
								label={`Listing common sort value ${sortValue} - ${current?.direction ?? "unused"}`}
								font={position ? "bold" : "normal"}
							/>

							{position ? (
								<Badge
									tone={"primary"}
									theme={"dark"}
									size={"sm"}
								>
									{position}
								</Badge>
							) : null}
						</div>
					</Button>
				);
			})}

			<Button
				iconEnabled={TrashIcon}
				size={"xl"}
				tone={"danger"}
				label={"Clear all sorts (button)"}
				full
				onClick={() => {
					onChange(() => {
						return [];
					});
				}}
			/>
		</Container>
	);
};
