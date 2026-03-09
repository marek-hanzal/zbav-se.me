import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { SaveIcon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { sFeedCreate } from "@zbav-se.me/sdk/api/buyer";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import type { FC } from "react";
import { useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { FEED_LIMIT } from "~/app/@common/limit/Limit";

export namespace SaveAsFeedButton {
	export interface Props extends Button.Props {
		feedId: string;
	}
}

export const SaveAsFeedButton: FC<SaveAsFeedButton.Props> = ({
	feedId,
	ui,
	className,
	...props
}) => {
	const navigate = useNavigate();
	const locale = useLocale();
	const { data: feed } = withFeedQuery.useFetchQuery(feedId);
	const { data: feedCount } = withFeedQuery.useCountQuery({
		filter: {
			type: "user",
		},
	});
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState("");
	const createMutation = withFeedQuery.useCreateMutation({
		async onPostMutation() {
			setIsOpen(false);
			await navigate({
				to: "/$locale/buyer/feed/list",
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

	const invalid = !name || name.length < sFeedCreate.properties.name.minLength;
	const isLimitReached = feedCount.filter >= FEED_LIMIT;

	return (
		<>
			<Button
				data-ui={"SaveAsFeedButton[Button]"}
				onClick={() => setIsOpen(true)}
				disabled={isLimitReached}
				iconEnabled={SaveIcon}
				ui={{
					tone: "secondary",
					theme: "light",
					...ui,
				}}
				className={className}
				{...props}
			>
				<Tx label={isLimitReached ? "Limit reached (title)" : "Save as feed (button)"} />
			</Button>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				header={() => ({
					title: "Create new feed (title)",
				})}
			>
				<Container
					data-ui={"SaveAsFeedButton[Container]"}
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
								<FormField>
									{(fieldProps) => (
										<TextInput
											value={name}
											onChange={(e) => {
												setName(e.target.value);
											}}
											placeholder={translator.text("Feed name (placeholder)")}
											autoFocus
											minLength={sFeedCreate.properties.name.minLength}
											{...fieldProps}
										/>
									)}
								</FormField>
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

					<SaveContainer
						onCancel={() => setIsOpen(false)}
						onSave={() => {
							createMutation.mutate({
								type: "user",
								name,
								locationId: feed.locationId,
								query: feed.query,
							});
						}}
						loading={createMutation.isPending}
						disabled={invalid || createMutation.isPending}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
