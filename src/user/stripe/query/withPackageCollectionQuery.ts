import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { packageCollectionFn } from "../server/fn/packageCollectionFn";
import type { PackageSchema } from "../server/schema/PackageSchema";

export const withPackageCollectionQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withPackageCollectionQuery",
	]),
	errors: {} as {
		query: packageCollectionFn.Error;
	},
	keys() {
		return [
			"stripe",
			"package",
			"collection",
		];
	},
	async queryFn(): Promise<PackageSchema.Type[]> {
		return packageCollectionFn();
	},
});
