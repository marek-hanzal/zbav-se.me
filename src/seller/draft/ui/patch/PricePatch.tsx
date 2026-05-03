import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view";
import { translator } from "@/lib/common/translation";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { Dial } from "~/common/ui/dial";
import { useAppForm } from "~/common/ui/form";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";

const FormSchema = z
	.looseObject({
		price: z.number(),
	})
	.strip();

export namespace PricePatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		view: useView.Use<"expires">;
	}
}

export const PricePatch: FC<PricePatch.Props> = ({ draft, onCancel, view, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			view.set("expires");
		},
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			price: draft.price ?? 0,
		},
		validators: {
			onMount: FormSchema,
			onChange: FormSchema,
			onBlur: FormSchema,
			onSubmit: FormSchema,
		},
		async onSubmit({ value }) {
			return mutation.mutateAsync({
				patch: {
					price: value.price,
					currency: "CZK",
				},
				query: {
					where: {
						id: draft.id,
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
									value === undefined ? 0 : Number.parseFloat(value),
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
