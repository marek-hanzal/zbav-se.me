import type { FC } from "react";
import { z } from "zod";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { Dial } from "~/application-ui/ui/Dial/index";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Container } from "~/ui/ui/Container";

const FormSchema = z
	.looseObject({
		price: z.number().nullable(),
	})
	.strip();

export namespace PriceMaxPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettledFn?(): void;
		onCancelFn(): void;
	}
}

export const PriceMaxPatch: FC<PriceMaxPatch.Props> = ({
	feed,
	onSettledFn,
	onCancelFn,
	...props
}) => {
	const translator = useTranslator();
	const mutation = withFeedQuery.usePatchMutation({
		onSettled: onSettledFn,
	});
	const form = useAppForm({
		defaultValues: {
			price: feed.query.where?.priceMax ?? null,
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
							typeof props.state.value === "number" ? props.state.value : undefined
						}
						onChangeFn={(value) => {
							props.handleChange(value ?? null);
							props.handleBlur();
						}}
						placeholder={translator.textFn("Maximum price (placeholder)")}
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
						onCancelFn={onCancelFn}
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
