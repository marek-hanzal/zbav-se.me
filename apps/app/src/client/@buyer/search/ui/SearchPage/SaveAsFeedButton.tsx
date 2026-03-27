import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { SaveIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { useAppForm } from "@zbav-se.me/ui/form";
import type { FC } from "react";
import { useState } from "react";
import { withFeedQuery } from "~/client/@buyer/feed/withFeedQuery";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { FeedCreateSchema } from "~/server/@buyer/feed/schema/FeedCreateSchema";

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
	ui,
	className,
	...props
}) => {
	const navigate = useNavigate();
	const locale = useLocale();
	const { data: feed } = withFeedQuery.useFetchQuery(feedId);
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState("");
	const createMutation = withFeedQuery.useCreateMutation({
		async onPostMutation() {
			setIsOpen(false);
			await navigate({
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
				onClick={() => setIsOpen(true)}
				iconEnabled={SaveIcon}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				ui={{
					tone: "neutral",
					theme: "light",
					size: "default",
					justify: "start",
					items: "center",
					background: "default",
					round: undefined,
					shadow: false,
					border: false,
					width: "full",
					...ui,
				}}
				className={className}
				{...props}
			>
				<Tx label={"Save as feed (button)"} />
			</Button>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				header={() => ({
					title: "Create new feed (title)",
				})}
			>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<Container
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
														value={name}
														onChange={(e) => {
															setName(e.target.value);
														}}
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
									onCancel={() => setIsOpen(false)}
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
		</>
	);
};
