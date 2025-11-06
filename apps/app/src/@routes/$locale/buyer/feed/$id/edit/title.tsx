import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CloseIcon,
} from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { FeedTitleContainer } from "~/app/feed/ui/FeedTitleContainer";

export const Route = createFileRoute("/$locale/buyer/feed/$id/edit/title")({
	component() {
		const { feed } = useLoaderData({
			from: "/$locale/buyer/feed/$id",
		});
		const { locale } = Route.useParams();
		const navigate = Route.useNavigate();
		const [change, setChange] = useState(false);
		const [title, setTitle] = useState(feed.filter?.title || "");

		const feedPatchMutation = withFeedPatchMutation.useMutation({
			async onPostMutation() {
				return navigate({
					to: "/$locale/buyer/feed/$id/edit/name",
				});
			},
		});

		return (
			<TitleContainer
				textTitle={"Feed title (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/$id/edit/age"}
						params={{
							locale,
							id: feed.id,
						}}
						tone={"secondary"}
					/>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						confirmProps={{
							tone: "danger",
							onClick: () => {
								navigate({
									to: "/$locale/buyer/feed/select",
								});
							},
						}}
					/>
				}
				bottom={
					<Button
						tone={"secondary"}
						theme={"dark"}
						iconEnabled={ArrowRightIcon}
						iconPosition={"right"}
						label={"Feed - next and save (button)"}
						size={"lg"}
						loading={feedPatchMutation.isPending}
						disabled={feedPatchMutation.isPending}
						full
						onClick={() => {
							if (!change) {
								navigate({
									to: "/$locale/buyer/feed/$id/edit/name",
								});
								return;
							}

							feedPatchMutation.mutate({
								id: feed.id,
								filter: {
									...feed.filter,
									title,
								},
							});
						}}
					/>
				}
			>
				<FeedTitleContainer
					value={title}
					onChange={(value) => {
						setChange(true);
						setTitle(value);
					}}
				/>
			</TitleContainer>
		);
	},
});
