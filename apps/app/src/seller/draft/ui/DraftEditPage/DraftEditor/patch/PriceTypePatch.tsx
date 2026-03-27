import { useSelection } from "@use-pico/client/hook";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { EntitySchema } from "@use-pico/common/schema";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useAppForm } from "@zbav-se.me/ui/form";
import type { FC } from "react";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import type { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { PriceTypeSelect } from "~/common/price-type/ui/PriceTypeSelect";
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
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
					inner: "default",
					gap: "default",
				}}
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
