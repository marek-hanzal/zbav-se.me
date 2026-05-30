import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { withUserResourceLimitQuery } from "~/user/user-resource/query/withUserResourceLimitQuery";
import { getUserResourceLimitQueryData } from "~/user/user-resource/service/getUserResourceLimitQueryData";

describe("withUserResourceLimitQuery invalidator", () => {
	it("invalidates only the targeted fetch key when request data is provided", async () => {
		const queryClient = new QueryClient();
		const target = getUserResourceLimitQueryData({
			resource: "feed.count",
		});
		const other = getUserResourceLimitQueryData({
			resource: "listing.count",
		});

		queryClient.setQueryData(withUserResourceLimitQuery.keys.fetch(target), {
			limit: 2,
		});
		queryClient.setQueryData(withUserResourceLimitQuery.keys.fetch(other), {
			limit: 5,
		});

		await withUserResourceLimitQuery.invalidator(
			queryClient,
			[
				"fetch",
			],
			{
				fetch: target,
			},
		);

		expect(
			queryClient.getQueryState(withUserResourceLimitQuery.keys.fetch(target))?.isInvalidated,
		).toBe(true);
		expect(
			queryClient.getQueryState(withUserResourceLimitQuery.keys.fetch(other))?.isInvalidated,
		).toBe(false);
	});
});
