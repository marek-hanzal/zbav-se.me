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
	const {
		data: { limit },
	} = withUserResourceLimitQuery.useFetchQuery({
		where: {
			resourceDefinitionId: resource,
			reference,
		},
	});

	const remaining = Math.max(limit - count, 0);

	return {
		count,
		limit,
		remaining,
		isAvailable: count < limit,
	} as const;
};
