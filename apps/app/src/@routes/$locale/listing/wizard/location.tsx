import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	LinkTo,
} from "@use-pico/client";
import { useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { ListingContainer } from "~/app/listing/ui/ListingContainer";
import { LocationSelection } from "~/app/location/ui/LocationSelection";

export const Route = createFileRoute("/$locale/listing/wizard/location")({
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
			<ListingContainer
				textTitle={"Location (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/listing/wizard/price"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/listing/wizard/expire-at"}
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
			</ListingContainer>
		);
	},
});
