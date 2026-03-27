import { useSelection } from "@use-pico/client/hook";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useAppForm } from "@zbav-se.me/ui/form";
import type { FC } from "react";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { RestrictionSelect } from "~/client/@common/restriction/ui/RestrictionSelect";
import { withDraftQuery } from "~/client/@seller/draft/query/withDraftQuery";
import type { ListingRestrictionEnumSchema } from "~/common/listing/enum/ListingRestrictionEnumSchema";
import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";
import { ListingCreateSchema } from "~/server/@seller/listing/schema/ListingCreateSchema";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

const RestrictionSchema = ListingCreateSchema.pick({
	restriction: true,
});

export namespace RestrictionPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const RestrictionPatch: FC<RestrictionPatch.Props> = ({
	draft,
	onCancel,
	onView,
	...props
}) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("default");
		},
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			restriction: (draft.restriction as ListingRestrictionEnumSchema.Type | null) ?? null,
		},
		validators: {
			onMount: RestrictionSchema,
			onChange: RestrictionSchema,
			onBlur: RestrictionSchema,
			onSubmit: RestrictionSchema,
		},
		async onSubmit({ value }) {
			mutation.mutate({
				patch: {
					restriction: value.restriction,
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
		initial: draft.restriction
			? [
					{
						id: draft.restriction,
					},
				]
			: [],
		onSelect(item) {
			form.setFieldValue(
				"restriction",
				(item?.id as ListingRestrictionEnumSchema.Type | undefined) ?? null,
			);
			form.setFieldMeta("restriction", (meta) => ({
				...meta,
				isTouched: true,
			}));
		},
	});

	return (
		<TitleContainer
			textTitle={translator.text("Listing restriction (title)")}
			data-ui={"Setup-[TitleContainer.restriction]"}
			left={<EditAction />}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
					inner: "default",
					gap: "default",
				}}
			>
				<form.AppField name={"restriction"}>
					{(_field) => <RestrictionSelect selection={selection} />}
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
