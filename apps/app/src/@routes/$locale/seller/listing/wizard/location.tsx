import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "@use-pico/client";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui";
import { useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { LocationSelection } from "~/app/location/ui/LocationSelection";

export const Route = createFileRoute("/$locale/seller/listing/wizard/location")(
	{
		validateSearch: ListingWizardSchema,
		component() {
			const { user } = useLoaderData({
				from: "/$locale",
			});
			const { locale } = Route.useParams();
			const state = Route.useSearch();
			const [locationId, setLocationId] = useState(
				state.locationId ?? user?.locationId ?? undefined,
			);

			return (
				<TitleContainer
					textTitle={"Location (title)"}
					left={
						<LinkTo
							icon={ArrowLeftIcon}
							to={"/$locale/seller/listing/wizard/price"}
							search={state}
							params={{
								locale,
							}}
							tone={"secondary"}
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
							full
						>
							<Button
								tone={"secondary"}
								theme={"dark"}
								iconEnabled={ArrowRightIcon}
								disabled={!locationId}
								size={"lg"}
								full
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
	},
);
