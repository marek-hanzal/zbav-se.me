import { createFileRoute } from "@tanstack/react-router";
import { MyListingPage } from "~/app/v0/@seller-user/listing/page/MyListingPage";

export const Route = createFileRoute("/$locale/seller/listing/my")({
	component: MyListingPage,
});
