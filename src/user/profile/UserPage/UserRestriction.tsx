import { useQueryClient } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { EditIcon, Icon } from "@/lib/client/icon";
import { CurrentRestriction } from "~/user/restriction/ui/CurrentRestriction";
import { withUserRestrictionQuery } from "~/user/user-restriction/query/withUserRestrictionQuery";
import { RestrictionSheet } from "./RestrictionSheet";

export const UserRestriction: FC = () => {
	const queryClient = useQueryClient();
	const [isRestriction, setIsRestriction] = useState(false);
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
					setIsRestriction((open) => !open);
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
					setIsRestriction(false);
				}}
				restriction={restriction?.restriction}
				onRestriction={async (restriction) => {
					return restrictionMutation.mutateAsync({
						restriction,
					});
				}}
				isPending={restrictionMutation.isPending}
			/>
		</>
	);
};
