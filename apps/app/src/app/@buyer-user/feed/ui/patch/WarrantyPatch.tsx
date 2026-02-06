import { useSelection } from "@use-pico/client/hook";
import type { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tFeed, tListingWarrantyEnum } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { useFeedPatch } from "~/app/@buyer-user/feed/hook/useFeedPatch";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";
import { WarrantySelect } from "~/app/@common/warranty/ui/WarrantySelect";

export namespace WarrantyPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const WarrantyPatch: FC<WarrantyPatch.Props> = ({
	feed,
	onSettled,
	onCancel,
	ui,
	...props
}) => {
	const { patch, isPending } = useFeedPatch({
		feed,
		onSettled,
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (feed.query?.filter?.warrantyIn ?? []).map((warranty) => ({
			id: warranty,
		})),
	});

	return (
		<PatchContainer
			data-ui={"WarrantyPatch[Container]"}
			ui={ui}
			onCancel={onCancel}
			onSave={() => {
				patch({
					query: {
						...feed.query,
						filter: {
							...feed.query?.filter,
							warrantyIn: selection.optional.multiId() as tListingWarrantyEnum[],
						},
					},
				});
			}}
			loading={isPending}
			disabled={false}
			{...props}
		>
			<WarrantySelect selection={selection} />
		</PatchContainer>
	);
};
