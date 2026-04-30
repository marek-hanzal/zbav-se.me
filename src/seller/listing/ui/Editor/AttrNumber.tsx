import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view2";
import { translator } from "@/lib/common/translation";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { Dial } from "~/common/ui/dial";
import { useAppForm } from "~/common/ui/form";
import { withAttrNumberPatchMutation } from "~/seller/attr-number/mutation/withAttrNumberPatchMutation";
import type { AttrOfSchema } from "~/user/attr/server/schema/AttrOfSchema";

const FormSchema = z
	.looseObject({
		value: z.number().int().nullable(),
	})
	.strip();

export namespace AttrNumber {
	export interface Props extends Container.Props {
		listingId: string;
		attr: Extract<
			AttrOfSchema.Type,
			{
				type: "number";
			}
		>;
		view: useView.Use<any>;
	}
}

export const AttrNumber: FC<AttrNumber.Props> = ({ listingId, attr, view, ...props }) => {
	const mutation = withAttrNumberPatchMutation.useMutation({
		onSuccess() {
			view.set("default");
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
				listingId,
				value: value.value,
			});
		},
	});

	return (
		<Container
			data-ui={"AttrNumber"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<form.AppField name={"value"}>
				{(field) => (
					<Dial
						value={
							typeof field.state.value === "number"
								? String(field.state.value)
								: undefined
						}
						onChange={(value) => {
							field.handleChange(
								value === undefined ? null : Number.parseFloat(value),
							);
							field.handleBlur();
						}}
						placeholder={translator.text("Price (placeholder)")}
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
