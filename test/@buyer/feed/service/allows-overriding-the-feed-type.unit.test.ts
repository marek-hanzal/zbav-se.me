import { describe, expect, it } from "vitest";
import { getFeedDefaultCreateFn } from "~/buyer-feed/service/getFeedDefaultCreateFn";

describe("getFeedDefaultCreate", () => {
	it("allows overriding the feed type", () => {
		const feed = getFeedDefaultCreateFn("Search Feed", "search");

		expect(feed.type).toBe("search");
		expect(feed.name).toBe("Search Feed");
		expect(feed.query.where.withIgnored).toBe(false);
	});
});
