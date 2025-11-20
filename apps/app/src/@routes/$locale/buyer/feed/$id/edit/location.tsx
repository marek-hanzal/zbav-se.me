import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { ArrowLeftIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { LocationSelection } from "~/app/location/ui/LocationSelection";

export const Route = createFileRoute("/$locale/buyer/feed/$id/edit/location")({
	component() {
		const { feed } = useLoaderData({
			from: "/$locale/buyer/feed/$id",
		});
		const { locale } = Route.useParams();
		const navigate = Route.useNavigate();
		const [change, setChange] = useState(false);
		const [locationId, setLocationId] = useState(feed.locationId);
		const [latLon, setLatLon] = useState(feed.query?.meta?.latLon);
		const feedPatchMutation = withFeedPatchMutation.useMutation({
			async onPostMutation() {
				return navigate({
					to: "/$locale/buyer/feed/$id/view",
				});
			},
		});

		return (
			<TitleContainer
				textTitle={"Feed location (title)"}
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
						loading={feedPatchMutation.isPending}
						disabled={feedPatchMutation.isPending}
						size={"lg"}
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
								locationId,
								query: {
									...feed.query,
									meta: {
										...feed.query?.meta,
										latLon,
									},
								},
							});
						}}
					/>
				}
			>
				<LocationSelection
					value={locationId}
					onChange={setLocationId}
					onLocation={({ lon, lat }) => {
						setChange(true);
						setLatLon({
							lon,
							lat,
						});
					}}
					textHint={"Feed - location security (hint)"}
				/>
			</TitleContainer>
		);
	},
});
