import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useSelection } from "@use-pico/client/hook";
import { ArrowLeftIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/session";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { Rating } from "~/app/ui/rating/Rating";

export const Route = createFileRoute("/$locale/buyer/feed/$id/edit/condition")({
	component() {
		const { feed } = useLoaderData({
			from: "/$locale/buyer/feed/$id",
		});
		const { locale } = Route.useParams();
		const navigate = Route.useNavigate();
		const [change, setChange] = useState(false);
		const selection = useSelection<Rating.RatingItem>({
			mode: "multi",
			initial: feed.query?.filter?.conditionIn?.map((item) => ({
				id: String(item),
			})),
			onMulti() {
				setChange(true);
			},
		});

		const conditionIn = selection.optional.multi().map((item) => Number.parseInt(item.id, 10));

		const feedPatchMutation = withFeedPatchMutation.useMutation({
			async onPostMutation() {
				return navigate({
					to: "/$locale/buyer/feed/$id/view",
				});
			},
		});

		return (
			<TitleContainer
				textTitle={"Feed condition (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/$id/view"}
						params={{
							locale,
							id: feed.id,
						}}
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
									params: {
										locale,
									},
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
								id: feed.id,
								query: {
									...feed.query,
									filter: {
										...feed.query?.filter,
										conditionIn,
									},
								},
							});
						}}
					/>
				}
			>
				<Rating
					textHint={(value) => `Condition - Overall [${value}] (hint)`}
					selection={selection}
				/>
			</TitleContainer>
		);
	},
});
