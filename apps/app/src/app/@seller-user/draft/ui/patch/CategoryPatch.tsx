import { useSelection } from "@use-pico/client/hook";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";
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
	const mutation = withDraftQuery.useMutation({
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
			title={translator.text("Listing category (title)")}
			data-ui={"Setup-[TitleContainer.category]"}
			onCancel={onCancel}
			onSave={() => {
				mutation.mutate({
					patch: {
						categoryId,
					},
					query: {
						where: {
							id: draft.id,
						},
					},
				});
			}}
			loading={mutation.isPending}
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
