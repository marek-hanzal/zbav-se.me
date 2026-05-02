import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { FormField } from "@/lib/client/form";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Status } from "@/lib/client/status";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view2";
import { translator } from "@/lib/common/translation";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { useAppForm } from "~/common/ui/form";
import { withAttrTextPatchMutation } from "~/seller/attr-text/mutation/withAttrTextPatchMutation";
import type { AttrOfSchema } from "~/user/attr/server/schema/AttrOfSchema";

const FormSchema = z
	.looseObject({
		value: z.string().nullable(),
	})
	.strip();

export namespace AttrText {
	export interface Props extends Container.Props {
		listingId: string;
		attrs: AttrOfSchema.Type[];
		attr: Extract<
			AttrOfSchema.Type,
			{
				type: "text";
			}
		>;
		view: useView.Use<any>;
	}
}

export const AttrText: FC<AttrText.Props> = ({ listingId, attrs, attr, view, ...props }) => {
	const mutation = withAttrTextPatchMutation.useMutation({
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
