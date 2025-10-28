import { createFileRoute } from "@tanstack/react-router";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";

export const Route = createFileRoute("/$locale/listing/wizard/age")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();

		return "age";
	},
});
