import { createFileRoute } from "@tanstack/react-router";
import { MyListingPage } from "~/client/@seller/listing/~public/MyListingPage";

export const Route = createFileRoute("/$locale/app/seller/listing/my")({
	component: MyListingPage,
});
