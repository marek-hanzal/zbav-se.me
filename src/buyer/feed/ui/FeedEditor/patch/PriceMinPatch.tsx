import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { useTranslator } from "@/lib/client/translation";
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

export namespace PriceMinPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const PriceMinPatch: FC<PriceMinPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const translator = useTranslator();
	const mutation = withFeedQuery.usePatchMutation({
		onSettled,
	});
	const form = useAppForm({
		defaultValues: {
			price: feed.query.filter?.priceMin ?? null,
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
							priceMin: value.price ?? undefined,
						},
					},
				},
			});
		},
	});

	return (
		<Container
			data-ui={"PriceMinPatch"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<form.AppField name={"price"}>
				{(price) => (
					<Dial
						value={
							typeof price.state.value === "number" ? price.state.value : undefined
						}
						onChange={(value) => {
							price.handleChange(value ?? null);
							price.handleBlur();
						}}
						placeholder={translator.text("Minimum price (placeholder)")}
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
