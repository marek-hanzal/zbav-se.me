import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";
import { LocationSelection } from "~/app/location/ui/LocationSelection";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/location")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const [locationId, setLocationId] = useState(state?.locationId);
		const [latLon, setLatLon] = useState(state.query?.meta?.latLon);

		return (
			<TitleContainer
				textTitle={"Feed location (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/select"}
						params={{
							locale,
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
					<LinkTo
						to={"/$locale/buyer/feed/wizard/sort"}
						params={{
							locale,
						}}
						search={{
							...state,
							locationId,
							query: {
								...state.query,
								meta: {
									...state.query?.meta,
									latLon,
								},
							},
						}}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							size={"lg"}
							label={"Next - feed sort (button)"}
							full
						/>
					</LinkTo>
				}
			>
				<LocationSelection
					value={locationId}
					onChange={setLocationId}
					onLocation={({ lon, lat }) =>
						setLatLon({
							lon,
							lat,
						})
					}
					textHint={"Feed - location security (hint)"}
				/>
			</TitleContainer>
		);
	},
});
