import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { EntitySchema } from "@/lib/common/schema";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { TitleContainer } from "~/common/ui/container";
import { useAppForm } from "~/common/ui/form";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";
import { CategorySelect } from "~/user/category/ui/CategorySelect";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

const CategorySchema = ListingCreateSchema.pick({
	categoryId: true,
});

export namespace CategoryPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const CategoryPatch: FC<CategoryPatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("location");
		},
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			categoryId: draft.categoryId ?? null,
		},
		validators: {
			onMount: CategorySchema,
			onChange: CategorySchema,
			onBlur: CategorySchema,
			onSubmit: CategorySchema,
		},
		async onSubmit({ value }) {
			mutation.mutate({
				patch: {
					categoryId: value.categoryId,
					restriction: null,
				},
				query: {
					where: {
						id: draft.id,
					},
				},
			});
		},
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
		deps: [
			draft,
		],
		onSelect(item) {
			form.setFieldValue("categoryId", item?.id ?? null);
			form.setFieldMeta("categoryId", (meta) => ({
				...meta,
				isTouched: true,
			}));
		},
	});

	return (
		<TitleContainer
			textTitle={translator.text("Listing category (title)")}
			data-ui={"Setup-[TitleContainer.category]"}
			left={<EditAction />}
			{...props}
		>
			<Container
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner="default"
				data-ui-gap="default"
			>
				<form.AppField name={"categoryId"}>
					{(field) => (
						<CategorySelect
							selection={selection}
							categoryId={field.state.value ?? undefined}
						/>
					)}
				</form.AppField>

				<form.Subscribe selector={(state) => state.isValid}>
					{(isValid) => (
						<SaveContainer
							onCancel={onCancel}
							onSave={() => {
								form.handleSubmit();
							}}
							loading={mutation.isPending}
							disabled={!isValid || mutation.isPending}
							textSave={<Tx label={"Continue (label)"} />}
							textCancel={<Tx label={"Back (label)"} />}
							saveProps={{
								iconEnabled: ArrowRightIcon,
								iconPosition: "right",
							}}
						/>
					)}
				</form.Subscribe>
			</Container>
		</TitleContainer>
	);
};
