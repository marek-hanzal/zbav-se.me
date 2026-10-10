import { useQueryClient } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { EditIcon } from "~/ui/constant/EditIcon";
import { Icon } from "~/ui/ui/Icon";
import { RestrictionSheet } from "~/user-profile/ui/RestrictionSheet";
import { withUserRestrictionQuery } from "~/user-restriction/query/withUserRestrictionQuery";
import { CurrentRestriction } from "~/user-restriction/ui/CurrentRestriction";

export const UserRestriction: FC = () => {
	const queryClient = useQueryClient();
	const [isRestriction, setIsRestrictionFn] = useState(false);
	const restrictionMutation = withUserRestrictionQuery.useCreateMutation({
		invalidate: [
			"collection",
		],
		async onSuccess() {
			setTimeout(() => {
				return queryClient.clear();
			}, 250);
		},
	});
	const {
		data: [restriction],
	} = withUserRestrictionQuery.useCollectionQuery({
		where: {
			isExpired: false,
		},
		cursor: {
			page: 0,
			size: 1,
		},
		sort: [
			{
				field: "createdAt",
				order: "desc",
			},
			{
				field: "availableAt",
				order: "desc",
			},
		],
	});

	return (
		<>
			<CurrentRestriction
				textLabelProps={{
					"data-ui-tone": "neutral",
				}}
				_suspense={"I know"}
				onClick={() => {
					setIsRestrictionFn((open) => !open);
				}}
				action={
					<Icon
						icon={EditIcon}
						data-ui-text={"lg"}
					/>
				}
			/>

			<RestrictionSheet
				isOpen={isRestriction}
				onClose={() => {
					setIsRestrictionFn(false);
				}}
				restriction={restriction?.restriction}
				onRestrictionFn={async (restriction) => {
					return restrictionMutation.mutateAsync({
						restriction,
					});
				}}
				isPending={restrictionMutation.isPending}
			/>
		</>
	);
};
