import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	LinkTo,
} from "@use-pico/client";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";

export const Route = createFileRoute("/$locale/listing/wizard/condition")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();

		return (
			<ListingContainer
				textTitle={"Condition (title)"}
				textSubtitle={"Condition (subtitle)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/listing/wizard/location"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/listing/wizard/condition"}
						params={{
							locale,
						}}
						search={{
							...state,
						}}
						// disabled={!locationId}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							// disabled={!locationId}
							size={"lg"}
							full
							iconPosition={"right"}
							label={"Next - age (button)"}
						/>
					</LinkTo>
				}
			>
				condition
			</ListingContainer>
		);
	},
});
