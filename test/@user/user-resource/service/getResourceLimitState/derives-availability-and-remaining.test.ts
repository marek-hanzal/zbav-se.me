import { describe, expect, it } from "vitest";
import { getResourceLimitState } from "~/user/user-resource/service/getResourceLimitState";

describe("getResourceLimitState", () => {
	it("derives availability from count and limit", () => {
		expect(
			getResourceLimitState({
				count: 1,
				limit: 3,
			}),
		).toEqual({
			count: 1,
			limit: 3,
			remaining: 2,
			isAvailable: true,
		});

		expect(
			getResourceLimitState({
				count: 3,
				limit: 3,
			}),
		).toEqual({
			count: 3,
			limit: 3,
			remaining: 0,
			isAvailable: false,
		});

		expect(
			getResourceLimitState({
				count: 4,
				limit: null,
			}),
		).toEqual({
			count: 4,
			limit: null,
			remaining: null,
			isAvailable: false,
		});
	});
});
