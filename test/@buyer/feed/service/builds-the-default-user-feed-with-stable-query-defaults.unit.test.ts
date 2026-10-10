import { describe, expect, it } from "vitest";
import { getFeedDefaultCreateFn } from "~/buyer-feed/service/getFeedDefaultCreateFn";

describe("getFeedDefaultCreate", () => {
	it("builds the default user feed with stable query defaults", () => {
		const feed = getFeedDefaultCreateFn("My Saved Feed");

		expect(feed).toEqual({
			type: "user",
			name: "My Saved Feed",
			query: {
				where: {
					withIgnored: false,
					statusIn: [
						"live",
					],
				},
				sort: [
					{
						field: "createdAt",
						order: "desc",
					},
				],
			},
		});
	});
});
