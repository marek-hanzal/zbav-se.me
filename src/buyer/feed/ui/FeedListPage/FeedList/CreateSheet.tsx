import type { FC } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Container } from "@/lib/client/container";
import { FormField } from "@/lib/client/form";
import { Mx } from "@/lib/client/mx";
import { Status } from "@/lib/client/status";
import { TextInput } from "@/lib/client/text-input";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense, StateType } from "@/lib/client/type";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import { getFeedDefaultCreate } from "~/buyer/feed/service/getFeedDefaultCreate";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { CloseButton } from "~/common/ui/button";
import { useAppForm } from "~/common/ui/form";
import { useResourceLimit } from "~/user/user-resource/hook/useResourceLimit";

const FormSchema = FeedCreateSchema.pick({
	name: true,
});

export namespace CreateSheet {
	export interface Props extends MarkSuspense.Props, BottomSheet.PropsEx {
		state: StateType.Simple<boolean>;
	}
}

export const CreateSheet: FC<CreateSheet.Props> = ({ _suspense, state, ...props }) => {
	const translator = useTranslator();
	const { data: feedCount } = withFeedQuery.useCountQuery({
		where: {
			type: "user",
		},
	});
	const resourceLimit = useResourceLimit({
		_suspense,
		resource: "feed.count",
		count: feedCount,
	});
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
			if (!resourceLimit.isAvailable) {
				return;
			}

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
					data-ui-layout="vertical-content-footer"
					data-ui-height="full"
					data-ui-width="full"
					data-ui-inner="default"
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
								onCancel={() => {
									state.set(false);
								}}
								onSave={() => {
									form.handleSubmit();
								}}
								loading={isSubmitting}
								disabled={!isValid || !resourceLimit.isAvailable}
							/>
						)}
					</form.Subscribe>
				</Container>
			</form>
		</BottomSheet>
	);
};
