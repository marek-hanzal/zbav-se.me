import type { FC } from "react";
import { z } from "zod";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { EditAction } from "~/application-ui/ui/EditAction";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { FormField } from "~/form/ui/FormField";
import { TitleSchema } from "~/listing/schema/TitleSchema";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller-draft/schema/DraftSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Mx } from "~/translation/ui/Mx";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { Container } from "~/ui/ui/Container";
import { Status } from "~/ui/ui/Status";
import type { useView } from "~/view/hook/useView";

const FormSchema = z
	.looseObject({
		title: TitleSchema,
	})
	.strip();

export namespace TitlePatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancelFn(): void;
		view: useView.Use<"category">;
	}
}

export const TitlePatch: FC<TitlePatch.Props> = ({ draft, onCancelFn, view, ...props }) => {
	const translator = useTranslator();
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			view.setFn("category");
		},
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			title: draft.title ?? "",
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
					title: value.title,
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
			data-ui={"TitlePatch"}
			textTitle={translator.textFn("Listing title (title)")}
			left={<EditAction />}
			{...props}
		>
			<Container
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner="default"
			>
				<Status
					action={
						<form
							className={"contents"}
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								form.handleSubmit();
							}}
						>
							<form.AppField name={"title"}>
								{(field) => (
									<FormField
										id={field.name}
										name={field.name}
										meta={field.state.meta}
										required
									>
										{(props) => (
											<field.TextInput
												value={field.state.value}
												onChange={(e) => {
													field.handleChange(e.target.value);
												}}
												onBlur={field.handleBlur}
												placeholder={translator.textFn(
													"Listing title (placeholder)",
												)}
												autoFocus
												{...props}
											/>
										)}
									</FormField>
								)}
							</form.AppField>
						</form>
					}
				>
					<Mx
						label={"Listing title (required)"}
						data-ui-tone="secondary"
						data-ui-theme="light"
					/>
				</Status>

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
