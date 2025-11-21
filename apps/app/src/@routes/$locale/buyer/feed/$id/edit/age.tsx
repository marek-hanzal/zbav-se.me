import { createFileRoute } from "@tanstack/react-router";
import { useSelection } from "@use-pico/client/hook";
import { ArrowLeftIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import { useState } from "react";
import { AgeContainer } from "../../../../../../../../../packages/@zbav-se.me/common/src/age/AgeContainer";

export const Route = createFileRoute("/$locale/buyer/feed/$id/edit/age")({
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
		const selection = useSelection<Rating.RatingItem>({
			mode: "multi",
			initial: feedFetchQuery.data.query?.filter?.ageIn?.map((item) => ({
				id: String(item),
			})),
			onMulti() {
				setChange(true);
			},
		});

		const ageIn = selection.optional.multi().map((item) => Number.parseInt(item.id, 10));

		const feedPatchMutation = withFeedPatchMutation.useMutation({
			async onPostMutation() {
				return navigate({
					to: "/$locale/buyer/feed/$id/view",
				});
			},
		});

		return (
			<TitleContainer
				textTitle={"Feed age (title)"}
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
										ageIn,
									},
								},
							});
						}}
					/>
				}
			>
				<AgeContainer selection={selection} />
			</TitleContainer>
		);
	},
});
