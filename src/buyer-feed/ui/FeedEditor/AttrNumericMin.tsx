import type { FC } from "react";
import { z } from "zod";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { Dial } from "~/application-ui/ui/Dial/index";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import type { AttrWhereSchema } from "~/buyer-listing/schema/AttrWhereSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Container } from "~/ui/ui/Container";
import type { CategoryAttrOfSchema } from "~/user-category/schema/CategoryAttrOfSchema";
import type { useView } from "~/view/hook/useView";

const FormSchema = z
	.looseObject({
		value: z.number().nullable(),
	})
	.strip();

export namespace AttrNumericMin {
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

export const AttrNumericMin: FC<AttrNumericMin.Props> = ({ feed, field, attr, view, ...props }) => {
	const translator = useTranslator();
	const mutation = withFeedQuery.usePatchMutation({
		onSuccess() {
			view.setFn("default");
		},
	});
	const form = useAppForm({
		defaultValues: {
			value: attr?.min ?? null,
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
									min: value.value ?? undefined,
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
			data-ui={"AttrNumericMin"}
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
						onChangeFn={(value) => {
							props.handleChange(value ?? null);
							props.handleBlur();
						}}
						placeholder={translator.textFn("Range minimum (placeholder)")}
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
						onCancelFn={() => {
							view.setFn("default");
						}}
						onSaveFn={() => {
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
