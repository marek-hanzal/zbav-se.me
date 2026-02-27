import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Group } from "@use-pico/client/ui/group";
import type { FC } from "react";
import { AgeValueList } from "~/app/@common/age/ui/AgeValueList";
import { ConditionValueList } from "~/app/@common/condition/ui/ConditionValueList";
import { DeliveryValueList } from "~/app/@common/delivery/ui/DeliveryValueList";
import { WarrantyValueList } from "~/app/@common/warranty/ui/WarrantyValueList";
import type { FeedEditor } from "~/app/v0/@buyer-user/feed/ui/FeedEditor";

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
