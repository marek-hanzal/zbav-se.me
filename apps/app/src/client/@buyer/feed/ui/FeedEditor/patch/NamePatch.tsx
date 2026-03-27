import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { translator } from "@use-pico/common/translator";
import { useAppForm } from "@zbav-se.me/ui/form";
import type { FC } from "react";
import { withFeedQuery } from "~/client/@buyer/feed/query/withFeedQuery";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { FeedCreateSchema } from "~/server/@buyer/feed/schema/FeedCreateSchema";
import type { FeedSchema } from "~/server/@buyer/feed/schema/FeedSchema";

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

export const NamePatch: FC<NamePatch.Props> = ({ feed, onSettled, onCancel, ui, ...props }) => {
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
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
					inner: "default",
					...ui,
				}}
				{...props}
			>
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
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
						ui={{
							text: "md",
							inner: "4xl",
						}}
					>
						<Mx
							label={translator.text("Feed name (required)")}
							ui={{
								tone: "neutral",
								theme: "light",
							}}
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
