import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common";
import z from "zod";

export const Route = createFileRoute("/$locale/listing/wizard/category")({
	validateSearch: z.object({
		uploadIds: z.array(z.string()).min(1, {
			error() {
				return translator.text("At least one photo is required!");
			},
		}),
		categoryGroupId: z
			.string()
			.min(1, {
				error() {
					return translator.text("Category group is required!");
				},
			})
			.optional(),
		categoryId: z.string().optional(),
	}),
	component() {
		//
	},
});
