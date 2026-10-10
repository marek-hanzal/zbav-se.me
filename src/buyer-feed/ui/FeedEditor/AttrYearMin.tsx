import { DateTime } from "luxon";
import type { FC } from "react";
import { z } from "zod";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { YearSelect } from "~/application-ui/ui/YearSelect";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import type { AttrWhereSchema } from "~/buyer-listing/schema/AttrWhereSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { useSelection } from "~/selection/hook/useSelection";
import { Container } from "~/ui/ui/Container";
import type { CategoryAttrOfSchema } from "~/user-category/schema/CategoryAttrOfSchema";
import type { useView } from "~/view/hook/useView";

const FormSchema = z
	.looseObject({
		value: z.number().nullable(),
	})
	.strip();

export namespace AttrYearMin {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		field: Extract<
			CategoryAttrOfSchema.Type,
			{
				type: "year";
			}
		>;
		attr:
			| Extract<
					AttrWhereSchema.Type,
					{
						type: "year";
					}
			  >
			| undefined;
		view: useView.Use<"default">;
	}
}

export const AttrYearMin: FC<AttrYearMin.Props> = ({ feed, field, attr, view, ...props }) => {
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
	const selection = useSelection({
		mode: "single",
		initial: attr?.value
			? [
					{
						id: String(attr.value),
					},
				]
			: [
					{
						id: String(DateTime.now().year),
					},
				],
		onSelect(item) {
			form.setFieldValue("value", item?.id ? Number.parseFloat(item.id) : null);
		},
	});

	return (
		<Container
			data-ui={"AttrYearMin"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<YearSelect
				selection={selection}
				from={undefined}
				to={undefined}
			/>

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
