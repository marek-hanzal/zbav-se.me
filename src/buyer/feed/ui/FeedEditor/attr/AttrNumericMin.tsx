import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import type { useView } from "@/lib/client/view";
import { translator } from "@/lib/common/translation";
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
	const mutation = withFeedQuery.usePatchMutation({
		onSuccess() {
			view.set("default");
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
						filter: {
							...feed.query?.filter,
							attrs: {
								...feed.query?.filter?.attrs,
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
