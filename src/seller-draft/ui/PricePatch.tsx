import type { FC } from "react";
import { z } from "zod";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { Dial } from "~/application-ui/ui/Dial/index";
import { EditAction } from "~/application-ui/ui/EditAction";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller-draft/schema/DraftSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { Container } from "~/ui/ui/Container";
import type { useView } from "~/view/hook/useView";

const FormSchema = z
	.looseObject({
		price: z.number(),
	})
	.strip();

export namespace PricePatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancelFn(): void;
		view: useView.Use<"expires">;
	}
}

export const PricePatch: FC<PricePatch.Props> = ({ draft, onCancelFn, view, ...props }) => {
	const translator = useTranslator();
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			view.setFn("expires");
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
			textTitle={translator.textFn("Price (title)")}
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
					{(props) => (
						<Dial
							value={
								typeof props.state.value === "number"
									? props.state.value
									: undefined
							}
							onChangeFn={(value) => {
								props.handleChange(value ?? 0);
								props.handleBlur();
							}}
							placeholder={translator.textFn("Price (placeholder)")}
							allowDecimals
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
							onCancelFn={onCancelFn}
							onSaveFn={() => {
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
