import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	LinkTo,
} from "@use-pico/client";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";

export const Route = createFileRoute("/$locale/listing/wizard/age")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();

		return (
			<ListingContainer
				textTitle={"Age (title)"}
				textSubtitle={"Age (subtitle)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/listing/wizard/condition"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/listing/wizard/price"}
						params={{
							locale,
						}}
						search={{
							...state,
						}}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							size={"lg"}
							full
							iconPosition={"right"}
							label={"Next - price (button)"}
						/>
					</LinkTo>
				}
			>
				age
			</ListingContainer>
		);
	},
});
