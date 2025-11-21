import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FeedNameContainer } from "@zbav-se.me/buyer/feed";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";

export const Route = createFileRoute("/$locale/buyer/feed/$id/edit/name")({
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
		const [name, setName] = useState(feedFetchQuery.data.name);

		const feedPatchMutation = withFeedPatchMutation.useMutation({
			async onPostMutation() {
				return navigate({
					to: "/$locale/buyer/feed/$id/view",
				});
			},
		});

		return (
			<TitleContainer
				textTitle={"Feed name (title)"}
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
						disabled={name.length === 0 || feedPatchMutation.isPending}
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
								name,
							});
						}}
					/>
				}
			>
				<FeedNameContainer
					value={name}
					onChange={(value) => {
						setChange(true);
						setName(value);
					}}
				/>
			</TitleContainer>
		);
	},
});
