import { TrashIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { StateType } from "@use-pico/common/type";
import { uiSelectButton } from "@zbav-se.me/ui/ui";
import { type FC, useId } from "react";
import type { ListingSortSchema } from "~/client/@buyer/listing/server/schema/ListingSortSchema";

export namespace ListingSortSelect {
	export interface Props extends Omit<Container.Props, "onChange"> {
		withGeo: boolean | undefined;
		state: StateType.Simple<ListingSortSchema.Type[]>;
	}
}

export const ListingSortSelect: FC<ListingSortSelect.Props> = ({ withGeo, state, ...props }) => {
	const sortKeyId = useId();

	return (
		<Container
			data-ui={"ListingSortSelect[Container]"}
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
					] satisfies (ListingSortSchema.Field | undefined)[]
				).filter(Boolean) as ListingSortSchema.Field[]
			).map((sortValue) => {
				const current = state.value.find((s) => s.field === sortValue);

				const position = current
					? state.value.findIndex((s) => s.field === sortValue) + 1
					: undefined;

				return (
					<Button
						key={`${sortKeyId}-${sortValue}`}
						data-action={`toggle sort by ${sortValue}`}
						onClick={() => {
							const idx = state.value.findIndex((s) => s.field === sortValue);

							if (idx < 0) {
								state.set([
									...state.value,
									{
										field: sortValue,
										order: "asc",
									} satisfies ListingSortSchema.Type,
								]);
								return;
							}

							const cur = state.value[idx];

							if (!cur || cur.field !== sortValue) {
								return;
							}

							if (cur.order === "asc") {
								const next = [
									...state.value,
								];
								next[idx] = {
									field: cur.field,
									order: "desc",
								} satisfies ListingSortSchema.Type;
								state.set(next);
								return;
							}

							state.set(state.value.filter((_, i) => i !== idx));
						}}
						{...uiSelectButton({
							isSelected: Boolean(current?.order),
							ui: {
								size: "default",
							},
							className: [],
						})}
					>
						<Container
							ui={{
								flow: "horizontal",
								justify: "space-between",
								items: "center",
								gap: "sm",
								width: "full",
							}}
						>
							<Tx
								label={`Listing common sort value ${sortValue} - ${current?.order ?? "unused"}`}
								ui={{
									font: position ? "bold" : "normal",
								}}
							/>

							{position}
						</Container>
					</Button>
				);
			})}

			<Button
				iconEnabled={TrashIcon}
				data-action={"clear all sorts"}
				onClick={() => {
					state.set([]);
				}}
				ui={{
					tone: "warning",
					theme: "light",
					size: "default",
				}}
			>
				<Tx label="Clear all sorts (button)" />
			</Button>
		</Container>
	);
};
