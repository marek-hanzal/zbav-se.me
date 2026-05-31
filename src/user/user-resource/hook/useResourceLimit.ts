import type { MarkSuspense } from "@/lib/client/type";
import type { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import { withUserResourceLimitQuery } from "~/user/user-resource/query/withUserResourceLimitQuery";

export namespace useResourceLimit {
	export interface Props extends MarkSuspense.Props {
		resource: ResourceDefinitionEnumSchema.Type;
		count: number;
		reference?: string;
	}
}

export const useResourceLimit = ({
	_suspense,
	resource,
	count,
	reference,
}: useResourceLimit.Props) => {
	const { data } = withUserResourceLimitQuery.useMaybeEntityQuery({
		where: {
			resourceDefinitionId: resource,
			reference,
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
