import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import z from "zod";

export const Route = createFileRoute("/$locale/ui/buyer/message/list")({
	validateSearch: z.object({
		open: z.string().optional(),
	}),
	component() {
		return <TitleContainer textTitle={"Messages (title)"}>I'll be back!</TitleContainer>;
	},
});
