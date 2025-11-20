import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useSelection } from "@use-pico/client/hook";
import { ArrowLeftIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { EntitySchema } from "@use-pico/common/schema";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { CategorySelectionContainer } from "~/app/category/ui/CategorySelectionContainer";

export const Route = createFileRoute("/$locale/buyer/feed/$id/edit/category")({
	component() {
		const { feed } = useLoaderData({
			from: "/$locale/buyer/feed/$id",
		});
		const { locale } = Route.useParams();
		const navigate = Route.useNavigate();
		const [change, setChange] = useState(false);

		const selection = useSelection<EntitySchema.Type>({
			mode: "multi",
			initial: feed.query?.filter?.categoryIdIn?.map((id) => ({
				id,
			})),
			onMulti() {
				setChange(true);
			},
		});

		const categoryIds = selection.optional.multiId();

		const feedPatchMutation = withFeedPatchMutation.useMutation({
			async onPostMutation() {
				return navigate({
					to: "/$locale/buyer/feed/$id/view",
				});
			},
		});

		return (
			<TitleContainer
				textTitle={"Feed category (title)"}
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
						size={"lg"}
						loading={feedPatchMutation.isPending}
						disabled={feedPatchMutation.isPending}
						label={"Feed - next and save (button)"}
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
										categoryIdIn: categoryIds,
									},
								},
							});
						}}
					/>
				}
			>
				<CategorySelectionContainer
					selection={selection}
					categoryId={selection.optional.singleId()}
				/>
			</TitleContainer>
		);
	},
});
