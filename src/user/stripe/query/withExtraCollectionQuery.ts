import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { extraCollectionFn } from "../server/fn/extraCollectionFn";
import type { ExtraSchema } from "../server/schema/ExtraSchema";

export const withExtraCollectionQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withExtraCollectionQuery",
	]),
	errors: {} as {
		query: extraCollectionFn.Error;
	},
	keys() {
		return [
			"stripe",
			"extra",
			"collection",
		];
	},
	async queryFn(): Promise<ExtraSchema.Type[]> {
		return extraCollectionFn();
	},
});
