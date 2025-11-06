import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { ArrowLeftIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { ListingSortSelect } from "~/app/listing/ui/ListingSortSelect";

export const Route = createFileRoute("/$locale/buyer/feed/$id/edit/sort")({
	component() {
		const { feed } = useLoaderData({
			from: "/$locale/buyer/feed/$id",
		});
		const { locale } = Route.useParams();
		const navigate = Route.useNavigate();
		const [change, setChange] = useState(false);
		const [sort, setSort] = useState(feed.sort ?? []);
		const feedPatchMutation = withFeedPatchMutation.useMutation({
			async onPostMutation() {
				return navigate({
					to: "/$locale/buyer/feed/$id/edit/view",
				});
			},
		});

		return (
			<TitleContainer
				textTitle={"Feed sorting (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/$id/edit/view"}
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
						size={"lg"}
						label={"Feed - next and save (button)"}
						loading={feedPatchMutation.isPending}
						disabled={feedPatchMutation.isPending}
						full
						onClick={() => {
							if (!change) {
								navigate({
									to: "/$locale/buyer/feed/$id/edit/view",
								});
								return;
							}

							feedPatchMutation.mutate({
								id: feed.id,
								sort,
							});
						}}
					/>
				}
			>
				<ListingSortSelect
					withGeo={!!feed.meta?.latLon}
					value={sort}
					onChange={(value) => {
						setChange(true);
						setSort(value);
					}}
				/>
			</TitleContainer>
		);
	},
});
