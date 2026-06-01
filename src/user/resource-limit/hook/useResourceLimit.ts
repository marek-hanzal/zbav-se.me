import type { MarkSuspense } from "@/lib/client/type";
import { withResourceLimitCheckQuery } from "~/user/resource-limit/query/withResourceLimitCheckQuery";
import type { ResourceLimitCheckSchema } from "~/user/resource-limit/server/schema/ResourceLimitCheckSchema";

export namespace useResourceLimit {
	export interface Props extends MarkSuspense.Props, ResourceLimitCheckSchema.Type {
		//
	}

	export type Use = ReturnType<typeof useResourceLimit>;
}

export const useResourceLimit = ({ count, resource }: useResourceLimit.Props) => {
	const { data } = withResourceLimitCheckQuery.useSuspenseQuery({
		count,
		resource,
	});

	return data;
};
