import { type FC, useId } from "react";
import { uiSelectButtonFn } from "~/application-ui/fn/ui.exports";
import type { ListingSortSchema } from "~/buyer-listing/schema/ListingSortSchema";
import { Tx } from "~/translation/ui/Tx";
import { TrashIcon } from "~/ui/constant/TrashIcon";
import type { StateType } from "~/ui/type/StateType";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";

export namespace ListingSortSelect {
	export interface Props extends Omit<Container.Props, "onChange"> {
		state: StateType.Simple<ListingSortSchema.Type[]>;
	}
}

export const ListingSortSelect: FC<ListingSortSelect.Props> = ({ state, ...props }) => {
	const sortKeyId = useId();

	return (
		<Container
			data-ui={"ListingSortSelect"}
			data-ui-layout="vertical-flex"
			data-ui-scroll="vertical"
			data-ui-gap="sm"
			data-ui-height="auto"
			data-ui-width="full"
			{...props}
		>
			{(
				(
					[
						"age",
						"price",
						"condition",
						"geo",
						"createdAt",
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
								state.setFn([
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
								state.setFn(next);
								return;
							}

							state.setFn(state.value.filter((_, i) => i !== idx));
						}}
						{...uiSelectButtonFn({
							isSelected: Boolean(current?.order),
							"data-ui-size": "default",
						})}
					>
						<Container
							data-ui-flow="horizontal"
							data-ui-justify="space-between"
							data-ui-items="center"
							data-ui-gap="sm"
							data-ui-width="full"
						>
							<Tx
								label={`Listing common sort value ${sortValue} - ${current?.order ?? "unused"}`}
								data-ui-font={position ? "bold" : "normal"}
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
					state.setFn([]);
				}}
				{...uiSelectButtonFn({
					isSelected: false,
				})}
				iconProps={{
					"data-ui-text": "xl",
				}}
				data-ui-tone={"warning"}
				data-ui-theme="light"
				data-ui-flow={"horizontal"}
				data-ui-justify={"start"}
				data-ui-items={"center"}
			>
				<Tx label="Clear all sorts (button)" />
			</Button>
		</Container>
	);
};
