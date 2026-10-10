import { expect, test } from "vitest";
import { testabaseFn } from "~/test/testabaseFn";

test("rejects a database allocation outside the integration project", () => {
	expect(() => testabaseFn("misclassified-unit-test")).toThrowError(
		"Database tests require the integration project",
	);
});
