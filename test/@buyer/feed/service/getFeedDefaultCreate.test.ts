import { describe, expect, it } from "vitest";
import { getFeedDefaultCreate } from "~/buyer/feed/service/getFeedDefaultCreate";

describe("getFeedDefaultCreate", () => {
	it("builds the default user feed with stable query defaults", () => {
		const feed = getFeedDefaultCreate("My Saved Feed");

		expect(feed).toEqual({
			type: "user",
			name: "My Saved Feed",
			query: {
				where: {
					withIgnored: false,
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

	it("allows overriding the feed type", () => {
		const feed = getFeedDefaultCreate("Search Feed", "search");

		expect(feed.type).toBe("search");
		expect(feed.name).toBe("Search Feed");
		expect(feed.query.filter.withIgnored).toBe(false);
	});
});
