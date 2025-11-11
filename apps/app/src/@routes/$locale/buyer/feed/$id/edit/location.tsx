import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/session";
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
		const [latLon, setLatLon] = useState(feed.meta?.latLon);
		const feedPatchMutation = withFeedPatchMutation.useMutation({
			async onPostMutation() {
				return navigate({
					to: "/$locale/buyer/feed/$id/edit/view",
				});
			},
		});

		return (
			<TitleContainer
				textTitle={"Feed location (title)"}
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
									to: "/$locale/buyer/feed/$id/edit/view",
								});
								return;
							}

							feedPatchMutation.mutate({
								id: feed.id,
								locationId,
								meta: {
									...feed.meta,
									latLon,
								},
							});
						}}
					/>
				}
			>
				<LocationSelection
					locale={locale}
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
