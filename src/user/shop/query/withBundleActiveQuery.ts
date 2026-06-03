import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withBundleActiveFn } from "../server/fn/withBundleActiveFn";
import type { BundleActiveSchema } from "../server/schema/BundleActiveSchema";

export const withBundleActiveQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withBundleActiveQuery",
	]),
	errors: {} as {
		query: withBundleActiveFn.Error;
	},
	keys(data: BundleActiveSchema.Type) {
		return [
			"shop",
			"bundle",
			"active",
			data,
		];
	},
	async queryFn(data: BundleActiveSchema.Type): Promise<boolean> {
		return withBundleActiveFn({
			data,
		});
	},
});
