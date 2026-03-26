import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { TextInput } from "@use-pico/client/ui/text-input";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { sProsCons, type tDraft } from "@zbav-se.me/sdk/api/seller";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { withDraftQuery } from "~/client/@seller/draft/withDraftQuery";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

export namespace ConsPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const ConsPatch: FC<ConsPatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const initialCons = draft.cons ?? [];
	const paddedCons = [
		...initialCons,
		...Array(sProsCons.maxItems - initialCons.length).fill(""),
	].slice(0, sProsCons.maxItems);
	const [items, setItems] = useState<string[]>(paddedCons);

	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("delivery");
		},
		invalidate: [
			"collection",
		],
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
			data-ui={"Setup-[TitleContainer.cons]"}
			textTitle={translator.text("Listing - Cons (title)")}
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
						<FormField key={`cons-field-${index}`}>
							{(props) => (
								<TextInput
									type="text"
									value={items[index] ?? ""}
									onChange={(e) => {
										updateItem(index, e.target.value);
									}}
									maxLength={sProsCons.items.maxLength}
									placeholder={translator.text(`Cons ${index} (placeholder)`)}
									{...props}
								/>
							)}
						</FormField>
					))}
				</Container>

				<Tx
					label={"Listing - Cons (message)"}
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
								cons: items.filter((item) => item.trim().length > 0),
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
