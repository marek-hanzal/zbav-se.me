import type { FC } from "react";
import { z } from "zod";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { Dial } from "~/application-ui/ui/Dial/index";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { useNextAttr } from "~/seller-draft/ui/Editor/useNextAttr";
import { withDraftAttrDecimalPatchMutation } from "~/seller-draft-attr-decimal/mutation/withDraftAttrDecimalPatchMutation";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { Container } from "~/ui/ui/Container";
import type { DraftAttrOfSchema } from "~/user-draft-attr/schema/DraftAttrOfSchema";
import type { useView } from "~/view/hook/useView";

const FormSchema = z
	.looseObject({
		value: z.number().nullable(),
	})
	.strip();

export namespace AttrDecimal {
	export interface Props extends Container.Props {
		draftId: string;
		attrs: DraftAttrOfSchema.Type[];
		attr: Extract<
			DraftAttrOfSchema.Type,
			{
				type: "decimal";
			}
		>;
		view: useView.Use<any>;
	}
}

export const AttrDecimal: FC<AttrDecimal.Props> = ({ draftId, attrs, attr, view, ...props }) => {
	const translator = useTranslator();
	const next = useNextAttr(attr, attrs);
	const mutation = withDraftAttrDecimalPatchMutation.useMutation({
		onSuccess() {
			view.set(next ? `attr.${next.name}` : "default");
		},
	});
	const form = useAppForm({
		defaultValues: {
			value: attr.value,
		},
		validators: {
			onMount: FormSchema,
			onChange: FormSchema,
			onBlur: FormSchema,
			onSubmit: FormSchema,
		},
		async onSubmit({ value }) {
			return mutation.mutateAsync({
				fieldId: attr.name,
				draftId,
				value: value.value,
			});
		},
	});

	return (
		<Container
			data-ui={"AttrDecimal"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<form.AppField name={"value"}>
				{(props) => (
					<Dial
						value={
							typeof props.state.value === "number" ? props.state.value : undefined
						}
						onChange={(value) => {
							props.handleChange(value ?? null);
							props.handleBlur();
						}}
						placeholder={translator.text("Price (placeholder)")}
						allowDecimals
						data-ui-inner="default"
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
						onCancel={() => {
							view.set("default");
						}}
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
	);
};
