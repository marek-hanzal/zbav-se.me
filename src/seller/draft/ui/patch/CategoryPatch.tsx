import type { FC } from "react";
import z from "zod";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view";
import type { EntitySchema } from "@/lib/common/schema";
import { translator } from "@/lib/common/translation";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { useAppForm } from "~/common/ui/form";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { CategorySelect } from "~/user/category/ui/CategorySelect";

const FormSchema = z
	.looseObject({
		categoryId: z.string().min(1),
	})
	.strip();

export namespace CategoryPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		view: useView.Use<"location">;
	}
}

export const CategoryPatch: FC<CategoryPatch.Props> = ({ draft, onCancel, view, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			view.set("location");
		},
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			categoryId: draft.categoryId,
		},
		validators: {
			onMount: FormSchema,
			onChange: FormSchema,
			onBlur: FormSchema,
			onSubmit: FormSchema,
		},
		async onSubmit({ value }) {
			return mutation.mutateAsync({
				patch: {
					categoryId: value.categoryId ?? undefined,
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
			data-ui={"CategoryPatch"}
			textTitle={translator.text("Listing category (title)")}
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
							withRestriction
						/>
					)}
				</form.AppField>

				<form.Subscribe
					selector={(state) => ({
						isValid: state.isValid,
						isSubmitting: state.isSubmitting,
					})}
				>
					{({ isValid, isSubmitting }) => (
						<SaveContainer
							onCancel={onCancel}
							onSave={() => {
								form.handleSubmit();
							}}
							loading={isSubmitting}
							disabled={!isValid || isSubmitting}
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
