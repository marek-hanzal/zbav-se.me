import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { TextInput } from "@use-pico/client/ui/text-input";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { withDraftQuery } from "~/client/@seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";
import { ProsConsSchema } from "~/server/@seller/listing/schema/ProsConsSchema";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

const PROS_CONS_MAX_ITEMS = 5;
const PROS_CONS_ITEM_MAX_LENGTH = 72;

export namespace ProsPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const ProsPatch: FC<ProsPatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const initialPros = draft.pros ?? [];
	const paddedPros = [
		...initialPros,
		...Array(PROS_CONS_MAX_ITEMS - initialPros.length).fill(""),
	].slice(0, PROS_CONS_MAX_ITEMS);
	const [items, setItems] = useState<string[]>(paddedPros);

	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("cons");
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
			data-ui={"Setup-[TitleContainer.pros]"}
			textTitle={translator.text("Listing - Pros (title)")}
			left={<EditAction />}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-header-content-footer",
					height: "full",
					scroll: "vertical",
					inner: "default",
				}}
			>
				<Container
					ui={{
						flow: "vertical",
						width: "full",
					}}
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
					ui={{
						text: "md",
						opacity: "6",
						color: "text",
					}}
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
									id: draft.id,
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
