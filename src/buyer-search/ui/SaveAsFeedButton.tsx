import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { useState } from "react";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import { FeedCreateSchema } from "~/buyer-feed/schema/FeedCreateSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { FormField } from "~/form/ui/FormField";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Mx } from "~/translation/ui/Mx";
import { Tx } from "~/translation/ui/Tx";
import { SaveIcon } from "~/ui/constant/SaveIcon";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";
import { Status } from "~/ui/ui/Status";
import { TextInput } from "~/ui/ui/TextInput";
import { withResourceLimitCheckQuery } from "~/user-resource-limit/query/withResourceLimitCheckQuery";

const FormSchema = FeedCreateSchema.pick({
	name: true,
});

export namespace SaveAsFeedButton {
	export interface Props extends Button.Props, MarkSuspense.Props {
		feedId: string;
	}
}

export const SaveAsFeedButton: FC<SaveAsFeedButton.Props> = ({
	_suspense,
	feedId,
	className,
	...props
}) => {
	const translator = useTranslator();
	const navigateFn = useNavigate();
	const locale = useLocale();
	const { data: feed } = withFeedQuery.useFetchQuery(feedId);
	const { data: feedCount } = withFeedQuery.useCountQuery({
		where: {
			type: "user",
		},
	});
	const { data: resourceLimit } = withResourceLimitCheckQuery.useSuspenseQuery({
		resource: "buyer:limit:feed.count",
		count: feedCount,
	});
	const [isOpen, setIsOpenFn] = useState(false);
	const [name, setNameFn] = useState("");
	const createMutation = withFeedQuery.useCreateMutation({
		async onPostMutationFn() {
			setIsOpenFn(false);
			await navigateFn({
				to: "/$locale/app/buyer/feed/list",
				params: {
					locale,
				},
			});
		},
		invalidate: [
			"collection",
			"count",
		],
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
			if (!resourceLimit.isAvailable) {
				return;
			}

			return createMutation.mutateAsync({
				...feed,
				...value,
			});
		},
	});

	return (
		<>
			<Button
				data-ui={"SaveAsFeedButton[Button]"}
				onClick={() => {
					if (!resourceLimit.isAvailable) {
						return;
					}

					setIsOpenFn(true);
				}}
				disabled={!resourceLimit.isAvailable}
				iconEnabled={SaveIcon}
				iconProps={{
					"data-ui-text": "xl",
				}}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-size="default"
				data-ui-justify="start"
				data-ui-items="center"
				data-ui-background="default"
				data-ui-round={undefined}
				data-ui-shadow={false}
				data-ui-border={false}
				data-ui-width="full"
				className={className}
				{...props}
			>
				<Tx label={"Save as feed (button)"} />
			</Button>

			<BottomSheet
				data-ui={"SaveAsFeedButton[BottomSheet]"}
				isOpen={isOpen}
				onClose={() => setIsOpenFn(false)}
				headerFn={() => ({
					title: "Create new feed (title)",
				})}
			>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className={"contents"}
				>
					<Container
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
								textTitle={translator.textFn("Feed name (title)")}
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
														value={name}
														onChange={(e) => {
															setNameFn(e.target.value);
														}}
														placeholder={translator.textFn(
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
									label={translator.textFn("Feed name (required)")}
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
									onCancelFn={() => setIsOpenFn(false)}
									onSaveFn={() => {
										form.handleSubmit();
									}}
									loading={isSubmitting}
									disabled={
										!isValid || isSubmitting || !resourceLimit.isAvailable
									}
								/>
							)}
						</form.Subscribe>
					</Container>
				</form>
			</BottomSheet>
		</>
	);
};
