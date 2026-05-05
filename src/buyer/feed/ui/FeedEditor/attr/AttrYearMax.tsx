import { DateTime } from "luxon";
import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { useSelection } from "@/lib/client/selection";
import type { useView } from "@/lib/client/view";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import type { AttrWhereSchema } from "~/buyer/listing/server/schema/AttrWhereSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { useAppForm } from "~/common/ui/form";
import { YearSelect } from "~/common/ui/year/YearSelect";
import type { CategoryAttrOfSchema } from "~/user/category/server/schema/CategoryAttrOfSchema";

const FormSchema = z
	.looseObject({
		value: z.number().nullable(),
	})
	.strip();

export namespace AttrYearMax {
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

export const AttrYearMax: FC<AttrYearMax.Props> = ({ feed, field, attr, view, ...props }) => {
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
						attrs: {
							...feed.query?.attrs,
							[field.name]: {
								...attr,
								name: field.name,
								type: field.type,
								max: value.value ?? undefined,
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
			data-ui={"AttrYearMax"}
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
