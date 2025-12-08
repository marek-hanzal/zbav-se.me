import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { asButton } from "@use-pico/theme/button";
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
						{...asButton({
							round: "full",
							square: "default",
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
						tone={"secondary"}
						iconProps={{
							size: "md",
						}}
						confirmProps={{
							tone: "danger",
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
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							disabled={!locationId}
							size={"xl"}
							iconPosition={"right"}
							label={"Next - expire (button)"}
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
