import { createFileRoute } from "@tanstack/react-router";
import { MyListingPage } from "~/app/@seller/listing/~public/MyListingPage";

export const Route = createFileRoute("/$locale/app/seller/listing/my")({
	component: MyListingPage,
});
