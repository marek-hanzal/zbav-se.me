import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { FormField } from "@/lib/client/form";
import { ArrowRightIcon } from "@/lib/client/icon";
import { TextInput } from "@/lib/client/text-input";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { ProsConsSchema } from "~/common/listing/schema/ProsConsSchema";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { withListingQuery } from "../../query/withListingQuery";
import type { ListingSchema } from "../../server/schema/ListingSchema";

const PROS_CONS_MAX_ITEMS = 5;
const PROS_CONS_ITEM_MAX_LENGTH = 72;

export namespace ProsPatch {
	export interface Props extends TitleContainer.Props {
		listing: ListingSchema.Type;
		onCancel(): void;
		setView(view: "cons"): void;
	}
}

export const ProsPatch: FC<ProsPatch.Props> = ({ listing, onCancel, setView, ...props }) => {
	const initialPros = listing.pros;
	const paddedPros = [
		...initialPros,
		...Array(PROS_CONS_MAX_ITEMS - initialPros.length).fill(""),
	].slice(0, PROS_CONS_MAX_ITEMS);
	const [items, setItems] = useState<string[]>(paddedPros);

	const mutation = withListingQuery.usePatchMutation({
		onSuccess() {
			setView("cons");
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
			data-ui={"ProsPatch"}
			textTitle={translator.text("Listing - Pros (title)")}
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
						<FormField key={`pros-field-${index}`}>
							{(props) => (
								<TextInput
									type="text"
									value={items[index] ?? ""}
									onChange={(e) => {
										updateItem(index, e.target.value);
									}}
									maxLength={PROS_CONS_ITEM_MAX_LENGTH}
									placeholder={translator.text(`Pros ${index} (placeholder)`)}
									{...props}
								/>
							)}
						</FormField>
					))}
				</Container>

				<Tx
					label={"Listing - Pros (message)"}
					data-ui-text="md"
					data-ui-opacity="6"
					data-ui-color="text"
					className={"text-center"}
				/>

				<SaveContainer
					onCancel={onCancel}
					onSave={() => {
						const pros = items.filter((item) => item.trim().length > 0);
						const parsed = ProsConsSchema.safeParse(pros);

						if (!parsed.success) {
							return;
						}

						mutation.mutate({
							patch: {
								pros: parsed.data,
							},
							query: {
								where: {
									id: listing.id,
								},
							},
						});
					}}
					loading={mutation.isPending}
					disabled={mutation.isPending}
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
