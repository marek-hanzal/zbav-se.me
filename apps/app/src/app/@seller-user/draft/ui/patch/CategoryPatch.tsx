import { useSelection } from "@use-pico/client/hook";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";
import { useDraftPatch } from "~/app/@seller-user/draft/hook/useDraftPatch";
import { CategorySelect } from "~/app/@session/category/ui/CategorySelect";

export namespace CategoryPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const CategoryPatch: FC<CategoryPatch.Props> = ({
	draft,
	onCancel,
	onSettled,
	...props
}) => {
	const { patch, isPending } = useDraftPatch({
		draft,
		onSettled,
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "single",
		initial: draft.categoryId
			? [
					{
						id: draft.categoryId,
					},
				]
			: [],
	});

	const categoryId = selection.optional.singleId() ?? null;

	return (
		<PatchContainer
			title="Listing category (title)"
			data-ui={"Setup-[TitleContainer.category]"}
			onCancel={onCancel}
			onSave={() =>
				patch({
					categoryId,
				})
			}
			loading={isPending}
			disabled={!categoryId}
			{...props}
		>
			<CategorySelect
				selection={selection}
				categoryId={categoryId ?? undefined}
			/>
		</PatchContainer>
	);
};
