import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { FormField } from "@/lib/client/form";
import { ArrowRightIcon } from "@/lib/client/icon";
import { TextInput } from "@/lib/client/text-input";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view2";
import { translator } from "@/lib/common/translation";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { ProsConsSchema } from "~/common/listing/schema/ProsConsSchema";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { withListingQuery } from "../../query/withListingQuery";
import type { ListingSchema } from "../../server/schema/ListingSchema";

const PROS_CONS_MAX_ITEMS = 5;
const PROS_CONS_ITEM_MAX_LENGTH = 72;

export namespace ConsPatch {
	export interface Props extends TitleContainer.Props {
		listing: ListingSchema.Type;
		onCancel(): void;
		view: useView.Use<"delivery">;
	}
}

export const ConsPatch: FC<ConsPatch.Props> = ({ listing, onCancel, view, ...props }) => {
	const initialCons = listing.cons;
	const paddedCons = [
		...initialCons,
		...Array(PROS_CONS_MAX_ITEMS - initialCons.length).fill(""),
	].slice(0, PROS_CONS_MAX_ITEMS);
	const [items, setItems] = useState<string[]>(paddedCons);

	const mutation = withListingQuery.usePatchMutation({
		onSuccess() {
			view.set("delivery");
		},
		invalidate: [
			"collection",
		],
	});

	const updateItem = (index: number, value: string) => {
		const updated = [
			...items,
		];
		updated[index] = value.slice(0, PROS_CONS_ITEM_MAX_LENGTH);
		setItems(updated);
	};

	return (
		<TitleContainer
			data-ui={"ConsPatch"}
			textTitle={translator.text("Listing - Cons (title)")}
			left={<EditAction />}
			{...props}
		>
			<Container
				data-ui-layout="vertical-header-content-footer"
				data-ui-height="full"
				data-ui-scroll="vertical"
				data-ui-inner="default"
			>
				<Container
					data-ui-flow="vertical"
					data-ui-width="full"
				>
					{Array.from({
						length: PROS_CONS_MAX_ITEMS,
					}).map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Static array of fields
						<FormField key={`cons-field-${index}`}>
							{(props) => (
								<TextInput
									type="text"
									value={items[index] ?? ""}
									onChange={(e) => {
										updateItem(index, e.target.value);
									}}
									maxLength={PROS_CONS_ITEM_MAX_LENGTH}
									placeholder={translator.text(`Cons ${index} (placeholder)`)}
									{...props}
								/>
							)}
						</FormField>
					))}
				</Container>

				<Tx
					label={"Listing - Cons (message)"}
					data-ui-text="md"
					data-ui-opacity="6"
					data-ui-color="text"
					className={"text-center"}
				/>

				<SaveContainer
					onCancel={onCancel}
					onSave={() => {
						const cons = items.filter((item) => item.trim().length > 0);
						const parsed = ProsConsSchema.safeParse(cons);

						if (!parsed.success) {
							return;
						}

						mutation.mutate({
							patch: {
								cons: parsed.data,
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
