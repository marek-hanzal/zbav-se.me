import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view2";
import type { EntitySchema } from "@/lib/common/schema";
import { translator } from "@/lib/common/translation";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import type { WarrantyEnumSchema } from "~/common/warranty/enum/WarrantyEnumSchema";
import { WarrantySelect } from "~/common/warranty/ui/WarrantySelect";
import { withListingQuery } from "../../query/withListingQuery";
import type { ListingSchema } from "../../server/schema/ListingSchema";

export namespace WarrantyPatch {
	export interface Props extends TitleContainer.Props {
		listing: ListingSchema.Type;
		onCancel(): void;
		view: useView.Use<"condition">;
	}
}

export const WarrantyPatch: FC<WarrantyPatch.Props> = ({ listing, onCancel, view, ...props }) => {
	const mutation = withListingQuery.usePatchMutation({
		onSuccess() {
			view.set("condition");
		},
		invalidate: [
			"collection",
		],
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "single",
		initial: listing.warranty
			? [
					{
						id: listing.warranty,
					},
				]
			: [],
		deps: [
			listing,
		],
	});

	const warrantyId = selection.optional.singleId();
	const warranty = (warrantyId as WarrantyEnumSchema.Type) ?? null;

	return (
		<TitleContainer
			data-ui={"WarrantyPatch"}
			textTitle={translator.text("Warranty (title)")}
			left={<EditAction />}
			{...props}
		>
			<Container
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner="default"
				data-ui-gap="default"
			>
				<WarrantySelect selection={selection} />

				<SaveContainer
					onCancel={onCancel}
					onSave={() => {
						mutation.mutate({
							patch: {
								warranty,
							},
							query: {
								where: {
									id: listing.id,
								},
							},
						});
					}}
					loading={mutation.isPending}
					disabled={false}
					textSave={<Tx label={"Continue (label)"} />}
					textCancel={<Tx label={"Back (label)"} />}
					saveProps={{
						iconEnabled: ArrowRightIcon,
						iconPosition: "right",
					}}
				/>
			</Container>
		</TitleContainer>
	);
};
