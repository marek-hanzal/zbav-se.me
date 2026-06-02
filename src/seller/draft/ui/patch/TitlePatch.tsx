import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { FormField } from "@/lib/client/form";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Mx } from "@/lib/client/mx";
import { Status } from "@/lib/client/status";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { TitleSchema } from "~/common/listing/schema/TitleSchema";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { useAppForm } from "~/common/ui/form";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";

const FormSchema = z
	.looseObject({
		title: TitleSchema,
	})
	.strip();

export namespace TitlePatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		view: useView.Use<"category">;
	}
}

export const TitlePatch: FC<TitlePatch.Props> = ({ draft, onCancel, view, ...props }) => {
	const translator = useTranslator();
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			view.set("category");
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
			textTitle={translator.text("Listing title (title)")}
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
												placeholder={translator.text(
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
