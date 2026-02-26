import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Group } from "@use-pico/client/ui/group";
import type { FC } from "react";
import type { FeedEditor } from "~/app/v0/@buyer-user/feed/ui/FeedEditor";
import { AgeValueList } from "~/app/v0/@common/age/ui/AgeValueList";
import { ConditionValueList } from "~/app/v0/@common/condition/ui/ConditionValueList";
import { DeliveryValueList } from "~/app/v0/@common/delivery/ui/DeliveryValueList";
import { WarrantyValueList } from "~/app/v0/@common/warranty/ui/WarrantyValueList";

export namespace FilterSection {
	export interface Props extends Pick<FeedEditor.Props, "feed" | "values"> {}
}

export const FilterSection: FC<FilterSection.Props> = ({ feed, values }) => {
	return (
		<>
			<Group>
				<ConditionValueList
					conditionIn={feed.query?.filter?.conditionIn ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone:
								(feed.query?.filter?.conditionIn ?? []).length > 0
									? "neutral"
									: "secondary",
						},
					}}
					{...values?.condition}
				/>

				<AgeValueList
					ageIn={feed.query?.filter?.ageIn ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone:
								(feed.query?.filter?.ageIn ?? []).length > 0
									? "neutral"
									: "secondary",
						},
					}}
					{...values?.age}
				/>
			</Group>

			<Group>
				<DeliveryValueList
					deliveryIn={feed.query?.filter?.deliveryIn ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone:
								(feed.query?.filter?.deliveryIn ?? []).length > 0
									? "neutral"
									: "secondary",
						},
					}}
					{...values?.delivery}
				/>
			</Group>

			<Group>
				<WarrantyValueList
					warrantyIn={feed.query?.filter?.warrantyIn ?? []}
					action={
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "xl",
							}}
						/>
					}
					wrapperProps={{
						ui: {
							tone:
								(feed.query?.filter?.warrantyIn ?? []).length > 0
									? "neutral"
									: "secondary",
						},
					}}
					{...values?.warranty}
				/>
			</Group>
		</>
	);
};
