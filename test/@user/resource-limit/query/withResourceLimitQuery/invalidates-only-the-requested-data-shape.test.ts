import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { withResourceLimitQuery } from "~/user/resource-limit/query/withResourceLimitQuery";
import type { ResourceLimitQuerySchema } from "~/user/resource-limit/server/schema/ResourceLimitQuerySchema";

describe("withResourceLimitQuery invalidator", () => {
	it("invalidates only the targeted fetch key when request data is provided", async () => {
		const queryClient = new QueryClient();
		const target: ResourceLimitQuerySchema.Type = {
			where: {
				resourceDefinitionId: "buyer:limit:feed.count",
			},
		};
		const other: ResourceLimitQuerySchema.Type = {
			where: {
				resourceDefinitionId: "seller:limit:listing.count",
			},
		};

		queryClient.setQueryData(withResourceLimitQuery.keys("fetch", target), {
			limit: 2,
		});
		queryClient.setQueryData(withResourceLimitQuery.keys("fetch", other), {
			limit: 5,
		});

		await withResourceLimitQuery.invalidator(
			queryClient,
			[
				"fetch",
			],
			{
				fetch: target,
			},
		);

		expect(
			queryClient.getQueryState(withResourceLimitQuery.keys("fetch", target))?.isInvalidated,
		).toBe(true);
		expect(
			queryClient.getQueryState(withResourceLimitQuery.keys("fetch", other))?.isInvalidated,
		).toBe(false);
	});
});
