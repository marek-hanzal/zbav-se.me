import { SnapperNav, type useSnapperNav } from "@use-pico/client";
import type { FC } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryGroupIcon } from "../../../../../../packages/@zbav-se.me/ui/src/icon/CategoryGroupIcon";
import { CategoryIcon } from "../../../../../../packages/@zbav-se.me/ui/src/icon/CategoryIcon";
import { ConditionIcon } from "../../../../../../packages/@zbav-se.me/ui/src/icon/ConditionIcon";
import { PhotoIcon } from "../../../../../../packages/@zbav-se.me/ui/src/icon/PhotoIcon";
import { PriceIcon } from "../../../../../../packages/@zbav-se.me/ui/src/icon/PriceIcon";
import { SendPackageIcon } from "../../../../../../packages/@zbav-se.me/ui/src/icon/SendPackageIcon";

export namespace SnapperPages {
	export interface Props {
		snapperNav: useSnapperNav.Result;
		photosId: string;
		categoryGroupId: string;
		categoryId: string;
		conditionId: string;
		priceId: string;
		locationId: string;
		submitId: string;
	}
}

export const SnapperPages: FC<SnapperPages.Props> = ({
	snapperNav,
	photosId,
	categoryGroupId,
	categoryId,
	conditionId,
	priceId,
	locationId,
	submitId,
}) => {
	const useCreateListingStore = useCreateListingContext();
	const hasCategoryGroup = useCreateListingStore(
		(store) => store.hasCategoryGroup,
	);
	const hasCategory = useCreateListingStore((store) => store.hasCategory);
	const hasPhotos = useCreateListingStore((store) => store.hasPhotos);
	const hasCondition = useCreateListingStore((store) => store.hasCondition);
	const hasAge = useCreateListingStore((store) => store.hasAge);
	const hasPrice = useCreateListingStore((store) => store.hasPrice);

	return (
		<SnapperNav
			limit={7}
			pages={[
				{
					id: photosId,
					icon: PhotoIcon,
					iconProps: () => ({
						tone: hasPhotos ? "primary" : "secondary",
					}),
				},
				{
					id: categoryGroupId,
					icon: CategoryGroupIcon,
					iconProps: () => ({
						tone: hasCategoryGroup ? "primary" : "secondary",
					}),
				},
				{
					id: categoryId,
					icon: CategoryIcon,
					iconProps: () => ({
						tone: hasCategory ? "primary" : "secondary",
					}),
				},
				{
					id: conditionId,
					icon: ConditionIcon,
					iconProps: () => ({
						tone: hasCondition && hasAge ? "primary" : "secondary",
					}),
				},
				{
					id: priceId,
					icon: PriceIcon,
					iconProps: () => ({
						tone: hasPrice ? "primary" : "secondary",
					}),
				},
				{
					id: locationId,
					icon: "icon-[bx--map-pin]",
				},
				{
					id: submitId,
					icon: SendPackageIcon,
				},
			]}
			iconProps={() => ({
				tone: "secondary",
				size: "md",
			})}
			orientation={"vertical"}
			subtle
			snapperNav={snapperNav}
		/>
	);
};
