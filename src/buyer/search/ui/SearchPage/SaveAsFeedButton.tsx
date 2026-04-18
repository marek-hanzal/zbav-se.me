import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { useState } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { FormField } from "@/lib/client/form";
import { SaveIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Mx } from "@/lib/client/mx";
import { Status } from "@/lib/client/status";
import { TextInput } from "@/lib/client/text-input";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { useAppForm } from "~/common/ui/form";

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
					"data-ui-text": "xl",
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
