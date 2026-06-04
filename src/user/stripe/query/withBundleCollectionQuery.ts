import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withBundleCollectionFn } from "../server/fn/withBundleCollectionFn";
import type { BundleSchema } from "../server/schema/BundleSchema";

export const withBundleCollectionQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withBundleCollectionQuery",
	]),
	errors: {} as {
		query: withBundleCollectionFn.Error;
	},
	keys() {
		return [
			"stripe",
			"bundle",
			"collection",
		];
	},
	async queryFn(): Promise<BundleSchema.Type[]> {
		return withBundleCollectionFn();
	},
});
