import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FeedTitleContainer } from "@zbav-se.me/buyer/feed";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";

export const Route = createFileRoute("/$locale/buyer/feed/$id/edit/title")({
	component() {
		const { id } = Route.useParams();
		const feedFetchQuery = withFeedFetchQuery.useSuspenseQuery({
			where: {
				id,
			},
		});
		const { locale } = Route.useParams();
		const navigate = Route.useNavigate();
		const [change, setChange] = useState(false);
		const [title, setTitle] = useState(feedFetchQuery.data.query?.filter?.title || "");

		const feedPatchMutation = withFeedPatchMutation.useMutation({
			async onPostMutation() {
				return navigate({
					to: "/$locale/buyer/feed/$id/view",
				});
			},
		});

		return (
			<TitleContainer
				textTitle={"Feed title (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/$id/view"}
						params={{
							locale,
							id,
						}}
					/>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						iconProps={{
							size: "md",
						}}
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
						label={"Feed - next and save (button)"}
						size={"lg"}
						loading={feedPatchMutation.isPending}
						disabled={feedPatchMutation.isPending}
						full
						onClick={() => {
							if (!change) {
								navigate({
									to: "/$locale/buyer/feed/$id/view",
								});
								return;
							}

							feedPatchMutation.mutate({
								id,
								query: {
									...feedFetchQuery.data.query,
									filter: {
										...feedFetchQuery.data.query?.filter,
										title,
									},
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
