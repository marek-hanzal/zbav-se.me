import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { EntitySchema } from "@/lib/common/schema";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import type { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { PriceTypeSelect } from "~/common/price-type/ui/PriceTypeSelect";
import { TitleContainer } from "~/common/ui/container";
import { useAppForm } from "~/common/ui/form";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

const PriceTypeSchema = ListingCreateSchema.pick({
	priceType: true,
});

export namespace PriceTypePatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const PriceTypePatch: FC<PriceTypePatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("expireAt");
		},
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			priceType: (draft.priceType as ListingPriceEnumSchema.Type | null) ?? null,
		},
		validators: {
			onMount: PriceTypeSchema,
			onChange: PriceTypeSchema,
			onBlur: PriceTypeSchema,
			onSubmit: PriceTypeSchema,
		},
		async onSubmit({ value }) {
			mutation.mutate({
				patch: {
					priceType: value.priceType,
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
		initial: draft.priceType
			? [
					{
						id: draft.priceType,
					},
				]
			: [],
		onSelect(item) {
			form.setFieldValue(
				"priceType",
				(item?.id as ListingPriceEnumSchema.Type | undefined) ?? null,
			);
			form.setFieldMeta("priceType", (meta) => ({
				...meta,
				isTouched: true,
			}));
		},
	});

	return (
		<TitleContainer
			textTitle={translator.text("Price type (title)")}
			data-ui={"Setup-[TitleContainer.price-type]"}
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
				<form.AppField name={"priceType"}>
					{(_field) => <PriceTypeSelect selection={selection} />}
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
