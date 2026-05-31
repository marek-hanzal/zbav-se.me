import { describe, expect, it } from "vitest";
import { getFeedDefaultCreate } from "~/buyer/feed/service/getFeedDefaultCreate";

describe("getFeedDefaultCreate", () => {
	it("allows overriding the feed type", () => {
		const feed = getFeedDefaultCreate("Search Feed", "search");

		expect(feed.type).toBe("search");
		expect(feed.name).toBe("Search Feed");
		expect(feed.query.where.withIgnored).toBe(false);
	});
});
