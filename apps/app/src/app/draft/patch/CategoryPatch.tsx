import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { CategorySelect } from "~/app/category/ui/CategorySelect";
import { SaveControl } from "~/app/control/SaveControl";

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
	const patch = withDraftFetchQuery.useSet();
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

	const mutation = withDraftPatchMutation.useMutation({
		onSuccess(draft) {
			patch(() => draft, {
				where: {
					id: draft.id,
				},
			});
		},
		onSettled() {
			onSettled?.();
		},
	});

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.category]"}
			textTitle={"Listing category (title)"}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
					gap: "default",
					inner: "default",
				}}
			>
				<CategorySelect
					selection={selection}
					categoryId={categoryId ?? undefined}
				/>

				<SaveControl
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
				/>
			</Container>
		</TitleContainer>
	);
};
