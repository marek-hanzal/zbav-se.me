import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { TextInput } from "@use-pico/client/ui/text-input";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { sProsCons, type tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { EditAction } from "~/app/@seller-user/draft/ui/DraftEditor/EditAction";

export namespace ProsPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const ProsPatch: FC<ProsPatch.Props> = ({ draft, onCancel, onSettled, ...props }) => {
	const initialPros = draft.pros ?? [];
	const paddedPros = [
		...initialPros,
		...Array(sProsCons.maxItems - initialPros.length).fill(""),
	].slice(0, sProsCons.maxItems);
	const [items, setItems] = useState<string[]>(paddedPros);

	const mutation = withDraftQuery.usePatchMutation({
		onSettled,
	});

	const updateItem = (index: number, value: string) => {
		const updated = [
			...items,
		];
		updated[index] = value.slice(0, sProsCons.items.maxLength);
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
						length: sProsCons.maxItems,
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
									maxLength={sProsCons.items.maxLength}
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
						mutation.mutate({
							patch: {
								pros: items.filter((item) => item.trim().length > 0),
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
					textCancel={<Tx label={"Back (label)"} />}
				/>
			</Container>
		</TitleContainer>
	);
};
