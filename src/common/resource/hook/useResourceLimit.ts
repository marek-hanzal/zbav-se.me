import type { MarkSuspense } from "@/lib/client/type";
import { withResourceLimitQuery } from "~/common/resource/query/withResourceLimitQuery";
import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export namespace useResourceLimit {
	export interface Props extends MarkSuspense.Props {
		resource: ResourceDefinitionEnumSchema.Type;
		count: number;
	}
}

export const useResourceLimit = ({ _suspense, resource, count }: useResourceLimit.Props) => {
	const { data } = withResourceLimitQuery.useMaybeEntityQuery({
		where: {
			resourceDefinitionId: resource,
		},
	});

	return data
		? ({
				count,
				limit: data.limit,
				remaining: Math.max(data.limit - count, 0),
				isAvailable: count < data.limit,
			} as const)
		: ({
				count,
				limit: 0,
				remaining: 0,
				isAvailable: false,
			} as const);
};
