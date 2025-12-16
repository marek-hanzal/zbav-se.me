import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import z from "zod";

export const Route = createFileRoute("/$locale/ui/seller/message/list")({
	validateSearch: z.object({
		open: z.string().optional(),
	}),
	component() {
		return (
			<TitleContainer
				data-ui="/seller/message/list[TitleContainer]"
				textTitle={"Messages (title)"}
			>
				I'll be back!
			</TitleContainer>
		);
	},
});
