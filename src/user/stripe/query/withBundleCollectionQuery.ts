import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { bundleCollectionFn } from "../server/fn/bundleCollectionFn";
import type { BundleSchema } from "../server/schema/BundleSchema";

export const withBundleCollectionQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withBundleCollectionQuery",
	]),
	errors: {} as {
		query: bundleCollectionFn.Error;
	},
	keys() {
		return [
			"stripe",
			"bundle",
			"collection",
		];
	},
	async queryFn(): Promise<BundleSchema.Type[]> {
		return bundleCollectionFn();
	},
});
