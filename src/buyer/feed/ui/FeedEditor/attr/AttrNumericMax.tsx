import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { useTranslator } from "@/lib/client/translation";
import type { useView } from "@/lib/client/view";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import type { AttrWhereSchema } from "~/buyer/listing/server/schema/AttrWhereSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { Dial } from "~/common/ui/dial";
import { useAppForm } from "~/common/ui/form";
import type { CategoryAttrOfSchema } from "~/user/category/server/schema/CategoryAttrOfSchema";

const FormSchema = z
	.looseObject({
		value: z.number().nullable(),
	})
	.strip();

export namespace AttrNumericMax {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		field: Extract<
			CategoryAttrOfSchema.Type,
			{
				type: "number" | "decimal" | "range";
			}
		>;
		attr:
			| Extract<
					AttrWhereSchema.Type,
					{
						type: "number" | "decimal" | "range";
					}
			  >
			| undefined;
		view: useView.Use<"default">;
	}
}

export const AttrNumericMax: FC<AttrNumericMax.Props> = ({ feed, field, attr, view, ...props }) => {
	const translator = useTranslator();
	const mutation = withFeedQuery.usePatchMutation({
		onSuccess() {
			view.set("default");
		},
	});
	const form = useAppForm({
		defaultValues: {
			value: attr?.max ?? null,
		},
		validators: {
			onMount: FormSchema,
			onChange: FormSchema,
			onBlur: FormSchema,
			onSubmit: FormSchema,
		},
		async onSubmit({ value }) {
			return mutation.mutateAsync({
				query: {
					where: {
						id: feed.id,
					},
				},
				patch: {
					query: {
						...feed.query,
						where: {
							...feed.query?.where,
							attrs: {
								...feed.query?.where?.attrs,
								[field.name]: {
									...attr,
									name: field.name,
									type: field.type,
									max: value.value ?? undefined,
								},
							},
						},
					},
				},
			});
		},
	});

	return (
		<Container
			data-ui={"AttrNumericMax"}
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
						placeholder={translator.text("Range minimum (placeholder)")}
						allowDecimals={field.type === "decimal"}
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
					/>
				)}
			</form.Subscribe>
		</Container>
	);
};
