import type { FC } from "react";
import { z } from "zod";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { EditAction } from "~/application-ui/ui/EditAction";
import { SaveContainer } from "~/container/ui/SaveContainer";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { PriceTypeEnumSchema } from "~/price-type/schema/PriceTypeEnumSchema";
import { PriceTypeSelect } from "~/price-type/ui/PriceTypeSelect/index";
import { useSelection } from "~/selection/hook/useSelection";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller-draft/schema/DraftSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { Container } from "~/ui/ui/Container";
import type { useView } from "~/view/hook/useView";

const PriceTypeSchema = z
	.looseObject({
		priceType: PriceTypeEnumSchema,
	})
	.strip();

export namespace PriceTypePatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		view: useView.Use<"expires" | "price">;
	}
}

export const PriceTypePatch: FC<PriceTypePatch.Props> = ({ draft, onCancel, view, ...props }) => {
	const translator = useTranslator();
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess({ priceType }) {
			view.set(priceType === "fixed" || priceType === "haggle" ? "price" : "expires");
		},
		invalidate: [
			"collection",
		],
	});

	const form = useAppForm({
		defaultValues: {
			priceType: draft.priceType ?? null,
		},
		validators: {
			onMount: PriceTypeSchema,
			onChange: PriceTypeSchema,
			onBlur: PriceTypeSchema,
			onSubmit: PriceTypeSchema,
		},
		async onSubmit({ value }) {
			return mutation.mutateAsync({
				patch: {
					priceType: value.priceType ?? undefined,
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
		deps: [
			draft,
		],
		onSelect(item) {
			if (!item) {
				return;
			}
			form.setFieldValue("priceType", item.id as PriceTypeEnumSchema.Type);
		},
	});

	return (
		<TitleContainer
			data-ui={"PriceTypePatch"}
			textTitle={translator.text("Price type (title)")}
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
