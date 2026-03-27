import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { FC } from "react";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import { getFeedDefaultCreate } from "~/buyer/feed/service/getFeedDefaultCreate";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { CloseButton } from "~/common/ui/button";
import { useAppForm } from "~/common/ui/form";

const FormSchema = FeedCreateSchema.pick({
	name: true,
});

export namespace CreateSheet {
	export interface Props extends BottomSheet.PropsEx {
		state: StateType.Simple<boolean>;
	}
}

export const CreateSheet: FC<CreateSheet.Props> = ({ state, ...props }) => {
	const feedCreateMutation = withFeedQuery.useCreateMutation({
		onSettled() {
			state.set(false);
		},
		invalidate: [
			"collection",
			"count",
		],
	});
	const form = useAppForm({
		defaultValues: {
			name: "",
		},
		validators: {
			onMount: FormSchema,
			onSubmit: FormSchema,
		},
		async onSubmit({ value: { name } }) {
			return feedCreateMutation.mutateAsync(getFeedDefaultCreate(name));
		},
	});

	return (
		<BottomSheet
			isOpen={state.value}
			onClose={() => state.set(false)}
			detent={"default"}
			header={({ close }) => ({
				title: "Create new feed (title)",
				right: (
					<CloseButton
						data-action={"close create feed"}
						onClick={close}
					/>
				),
			})}
			{...props}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<Container
					data-ui={"CreateButton[TextInputContainer]"}
					ui={{
						layout: "vertical-content-footer",
						height: "full",
						width: "full",
						inner: "default",
					}}
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
													onChange={(e) =>
														field.handleChange(e.target.value)
													}
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
								onCancel={() => {
									state.set(false);
								}}
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
		</BottomSheet>
	);
};
