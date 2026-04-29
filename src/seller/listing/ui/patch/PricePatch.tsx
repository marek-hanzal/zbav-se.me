import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { Dial } from "~/common/ui/dial";
import { useAppForm } from "~/common/ui/form";
import { withListingQuery } from "../../query/withListingQuery";
import type { ListingSchema } from "../../server/schema/ListingSchema";

const FormSchema = z.object({
	price: z.number().positive().nullable(),
});

export namespace PricePatch {
	export interface Props extends TitleContainer.Props {
		listing: ListingSchema.Type;
		onCancel(): void;
		setView(view: "expireAt"): void;
	}
}

export const PricePatch: FC<PricePatch.Props> = ({ listing, onCancel, setView, ...props }) => {
	const mutation = withListingQuery.usePatchMutation({
		onSuccess() {
			setView("expireAt");
		},
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			price: listing.price ?? null,
		},
		validators: {
			onMount: FormSchema,
			onChange: FormSchema,
			onBlur: FormSchema,
			onSubmit: FormSchema,
		},
		async onSubmit({ value }) {
			mutation.mutate({
				patch: {
					price: value.price,
				},
				query: {
					where: {
						id: listing.id,
					},
				},
			});
		},
	});

	return (
		<TitleContainer
			data-ui={"PricePatch"}
			textTitle={translator.text("Price (title)")}
			left={<EditAction />}
			{...props}
		>
			<Container
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner="default"
				data-ui-gap="default"
			>
				<form.AppField name={"price"}>
					{(field) => (
						<Dial
							value={
								typeof field.state.value === "number"
									? String(field.state.value)
									: undefined
							}
							onChange={(value) => {
								field.handleChange(
									value === undefined ? null : Number.parseFloat(value),
								);
								field.handleBlur();
							}}
							placeholder={translator.text("Price (placeholder)")}
							data-ui-inner="default"
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
		</TitleContainer>
	);
};
