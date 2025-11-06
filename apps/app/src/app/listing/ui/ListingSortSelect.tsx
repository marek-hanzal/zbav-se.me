import { Badge } from "@use-pico/client/ui/badge";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { tListingSort } from "@zbav-se.me/sdk/api/session";
import { type FC, useId } from "react";

export namespace ListingSortSelect {
	export interface Props extends Container.Props {
		withGeo?: boolean;
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
			layout={"vertical-flex"}
			scroll={"vertical"}
			gap={"sm"}
			height={"auto"}
			width={"fit"}
			{...props}
		>
			{(
				(
					[
						"age",
						"price",
						"condition",
						withGeo ? "geo" : undefined,
					] satisfies (tListingSort["value"] | undefined)[]
				).filter(Boolean) as tListingSort["value"][]
			).map((sortValue) => {
				const current = value.find((s) => s.value === sortValue);

				const position = current
					? value.findIndex((s) => s.value === sortValue) + 1
					: undefined;

				return (
					<Button
						key={`${sortKeyId}-${sortValue}`}
						size={"xl"}
						tweak={{
							slot: {
								root: {
									class: [
										"justify-start",
										"text-left",
									],
								},
							},
						}}
						full
						onClick={() => {
							onChange((prev) => {
								const idx = prev.findIndex(
									(s) => s.value === sortValue,
								);

								if (idx < 0) {
									return [
										...prev,
										{
											value: sortValue,
											sort: "asc",
										} satisfies tListingSort,
									];
								}

								const cur = prev[idx];

								if (!cur || cur.value !== sortValue) {
									return prev;
								}

								if (cur.sort === "asc") {
									const next = [
										...prev,
									];
									next[idx] = {
										value: cur.value,
										sort: "desc",
									} satisfies tListingSort;
									return next;
								}

								return prev.filter((_, i) => i !== idx);
							});
						}}
					>
						<div className="flex items-center gap-2">
							<Badge
								tone={position ? "primary" : "secondary"}
								theme={position ? "dark" : "light"}
								size={"sm"}
								tweak={{
									slot: {
										root: {
											class: [
												"py-2",
												"px-4",
											],
										},
									},
								}}
							>
								{position ?? "-"}
							</Badge>

							<Tx
								label={`Listing common sort value ${sortValue} - ${current?.sort ?? "unused"}`}
							/>
						</div>
					</Button>
				);
			})}
		</Container>
	);
};
