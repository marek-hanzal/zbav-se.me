import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { FormField } from "@/lib/client/form";
import { Mx } from "@/lib/client/mx";
import { Status } from "@/lib/client/status";
import { TextInput } from "@/lib/client/text-input";
import { translator } from "@/lib/common/translator";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { useAppForm } from "~/common/ui/form";

const FormSchema = FeedCreateSchema.pick({
	name: true,
});

export namespace NamePatch {
	export interface Props extends Omit<Container.Props, "defaultValue"> {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const NamePatch: FC<NamePatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled,
	});
	const form = useAppForm({
		defaultValues: {
			name: feed.name,
		},
		validators: {
			onMount: FormSchema,
			onSubmit: FormSchema,
		},
		async onSubmit({ value }) {
			return patchMutation.mutateAsync({
				query: {
					where: {
						id: feed.id,
					},
				},
				patch: value,
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<Container
				data-ui={"NamePatch"}
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner="default"
				{...props}
			>
				<Container
					data-ui-layout="vertical-centered"
					data-ui-height="full"
				>
					<Status
						textTitle={translator.text("Feed name (title)")}
						action={
							<form.AppField name={"name"}>
								{(field) => (
									<FormField
										id={field.name}
										name={field.name}
										meta={field.state.meta}
										required
									>
										{(props) => (
											<TextInput
												value={field.state.value ?? ""}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder={translator.text(
													"Feed name (placeholder)",
												)}
												autoFocus
												{...props}
											/>
										)}
									</FormField>
								)}
							</form.AppField>
						}
						data-ui-text="md"
						data-ui-inner="4xl"
					>
						<Mx
							label={translator.text("Feed name (required)")}
							data-ui-tone="neutral"
							data-ui-theme="light"
						/>
					</Status>
				</Container>

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
							disabled={!isValid}
						/>
					)}
				</form.Subscribe>
			</Container>
		</form>
	);
};
