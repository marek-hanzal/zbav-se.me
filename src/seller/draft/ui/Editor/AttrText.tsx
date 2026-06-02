import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { FormField } from "@/lib/client/form";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Status } from "@/lib/client/status";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { useAppForm } from "~/common/ui/form";
import { withDraftAttrTextPatchMutation } from "~/seller/draft-attr-text/mutation/withDraftAttrTextPatchMutation";
import type { DraftAttrOfSchema } from "~/user/draft-attr/server/schema/DraftAttrOfSchema";
import { useNextAttr } from "./useNextAttr";

const FormSchema = z
	.looseObject({
		value: z.string().nullable(),
	})
	.strip();

export namespace AttrText {
	export interface Props extends Container.Props {
		draftId: string;
		attrs: DraftAttrOfSchema.Type[];
		attr: Extract<
			DraftAttrOfSchema.Type,
			{
				type: "text";
			}
		>;
		view: useView.Use<any>;
	}
}

export const AttrText: FC<AttrText.Props> = ({ draftId, attrs, attr, view, ...props }) => {
	const translator = useTranslator();
	const next = useNextAttr(attr, attrs);
	const mutation = withDraftAttrTextPatchMutation.useMutation({
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
			data-ui={"AttrText"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<Container data-ui-layout={"vertical-centered"}>
				<Status
					data-ui-inner={"4xl"}
					action={
						<form
							className={"contents"}
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								form.handleSubmit();
							}}
						>
							<form.AppField name={"value"}>
								{(field) => (
									<FormField
										id={field.name}
										name={field.name}
										meta={field.state.meta}
										required
									>
										{(props) => (
											<field.TextInput
												value={field.state.value ?? ""}
												onChange={(e) => {
													field.handleChange(e.target.value);
												}}
												onBlur={field.handleBlur}
												placeholder={translator.text(
													`${attr.name} - placeholder`,
													attr.name,
												)}
												autoFocus
												{...props}
											/>
										)}
									</FormField>
								)}
							</form.AppField>
						</form>
					}
				/>
			</Container>

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
