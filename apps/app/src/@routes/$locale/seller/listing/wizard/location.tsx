import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton, uiButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { LocationSelection } from "~/app/location/ui/LocationSelection";

export const Route = createFileRoute("/$locale/seller/listing/wizard/location")({
	validateSearch: ListingWizardSchema,
	component() {
		const { user } = useLoaderData({
			from: "/$locale",
		});
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const [locationId, setLocationId] = useState(
			state.locationId ?? user?.locationId ?? undefined,
		);

		return (
			<TitleContainer
				data-ui={"Location"}
				textTitle={"Location (title)"}
				left={
					<LinkTo
						{...uiButton({
							ui: {
								round: "full",
								square: "default",
								opacity: "subtle",
							},
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/price"}
						search={state}
						params={{
							locale,
						}}
					/>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						ui={{
							tone: "secondary",
						}}
						iconProps={{
							ui: {
								size: "md",
							},
						}}
						confirmProps={{
							ui: {
								tone: "danger",
							},
							onClick: () => {
								navigate({
									to: "/$locale/seller",
								});
							},
						}}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/seller/listing/wizard/expire-at"}
						params={{
							locale,
						}}
						search={{
							...state,
							locationId,
						}}
						disabled={!locationId}
					>
						<Button
							iconEnabled={ArrowRightIcon}
							disabled={!locationId}
							iconPosition={"right"}
							label={"Next - expire (button)"}
							ui={{
								tone: "secondary",
								theme: "dark",
								size: "xl",
							}}
						/>
					</LinkTo>
				}
			>
				<LocationSelection
					locale={locale}
					value={locationId}
					onChange={setLocationId}
				/>
			</TitleContainer>
		);
	},
});
