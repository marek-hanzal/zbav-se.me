import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, LinkTo } from "@use-pico/client";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";

export const Route = createFileRoute("/$locale/listing/wizard/submit")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();

		return (
			<ListingContainer
				textTitle={"Submit (title)"}
				textSubtitle={"Submit (subtitle)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/listing/wizard/expire-at"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
			>
				submit!
			</ListingContainer>
		);
	},
});
