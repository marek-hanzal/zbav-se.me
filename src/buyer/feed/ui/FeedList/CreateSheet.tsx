import type { FC } from "react";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import { getFeedDefaultCreate } from "~/buyer/feed/service/getFeedDefaultCreate";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { CloseButton } from "~/common/ui/button";
import { useAppForm } from "~/common/ui/form";
import { FormField } from "~/form/ui/FormField";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Mx } from "~/translation/ui/Mx";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import type { StateType } from "~/ui/type/StateType";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { Container } from "~/ui/ui/Container";
import { Status } from "~/ui/ui/Status";
import { TextInput } from "~/ui/ui/TextInput";
import { withResourceLimitCheckQuery } from "~/user/resource-limit/query/withResourceLimitCheckQuery";

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
	const { data: resourceLimit } = withResourceLimitCheckQuery.useSuspenseQuery({
		resource: "buyer:limit:feed.count",
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
