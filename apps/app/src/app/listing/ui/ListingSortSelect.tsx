import { TrashIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { StateType } from "@use-pico/common/type";
import type { tListingSort, tListingSortField } from "@zbav-se.me/sdk/api/user";
import { type FC, useId } from "react";

export namespace ListingSortSelect {
	export interface Props extends Omit<Container.Props, "onChange"> {
		withGeo: boolean | undefined;
		state: StateType.Simple<tListingSort[]>;
	}
}

export const ListingSortSelect: FC<ListingSortSelect.Props> = ({ withGeo, state, ...props }) => {
	const sortKeyId = useId();

	return (
		<Container
			data-ui={"ListingSortSelect"}
			ui={{
				layout: "vertical-flex",
				scroll: "vertical",
				gap: "sm",
				height: "auto",
				width: "full",
			}}
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
				const current = state.value.find((s) => s.field === sortValue);

				const position = current
					? state.value.findIndex((s) => s.field === sortValue) + 1
					: undefined;

				return (
					<Button
						key={`${sortKeyId}-${sortValue}`}
						className={[
							"justify-start",
							"text-left",
							"py-2",
							"px-3",
							"h-18",
						]}
						ui={{
							size: "xl",
						}}
						onClick={() => {
							const idx = state.value.findIndex((s) => s.field === sortValue);

							if (idx < 0) {
								state.set([
									...state.value,
									{
										field: sortValue,
										direction: "asc",
									} satisfies tListingSort,
								]);
								return;
							}

							const cur = state.value[idx];

							if (!cur || cur.field !== sortValue) {
								return;
							}

							if (cur.direction === "asc") {
								const next = [
									...state.value,
								];
								next[idx] = {
									field: cur.field,
									direction: "desc",
								} satisfies tListingSort;
								state.set(next);
								return;
							}

							state.set(state.value.filter((_, i) => i !== idx));
						}}
					>
						<div className="flex gap-2 items-center justify-between w-full">
							<Tx
								label={`Listing common sort value ${sortValue} - ${current?.direction ?? "unused"}`}
								ui={{
									font: position ? "bold" : "normal",
								}}
							/>

							{position ? (
								<Badge
									ui={{
										tone: "primary",
										theme: "dark",
										size: "sm",
									}}
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
				label={"Clear all sorts (button)"}
				onClick={() => {
					state.set([]);
				}}
				ui={{
					size: "xl",
					tone: "danger",
				}}
			/>
		</Container>
	);
};
