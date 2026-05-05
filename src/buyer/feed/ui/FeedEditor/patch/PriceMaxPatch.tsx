import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { translator } from "@/lib/common/translation";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { Dial } from "~/common/ui/dial";
import { useAppForm } from "~/common/ui/form";

const FormSchema = z
	.looseObject({
		price: z.number().nullable(),
	})
	.strip();

export namespace PriceMaxPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const PriceMaxPatch: FC<PriceMaxPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const mutation = withFeedQuery.usePatchMutation({
		onSettled,
	});
	const form = useAppForm({
		defaultValues: {
			price: feed.query.filter?.priceMax ?? null,
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
							priceMax: value.price ?? undefined,
						},
					},
				},
			});
		},
	});

	return (
		<Container
			data-ui={"PriceMaxPatch"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<form.AppField name={"price"}>
				{(props) => (
					<Dial
						value={
							typeof props.state.value === "number"
								? String(props.state.value)
								: undefined
						}
						onChange={(value) => {
							props.handleChange(
								value === undefined ? null : Number.parseFloat(value),
							);
							props.handleBlur();
						}}
						placeholder={translator.text("Maximum price (placeholder)")}
						allowDecimals
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
						onCancel={onCancel}
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
