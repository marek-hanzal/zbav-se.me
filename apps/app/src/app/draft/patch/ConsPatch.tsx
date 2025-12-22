import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { TextInput } from "@use-pico/client/ui/text-input";
import { Tx } from "@use-pico/client/ui/tx";
import { sProsCons, type tDraft } from "@zbav-se.me/sdk/api/user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveControl } from "~/app/control/SaveControl";

export namespace ConsPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const ConsPatch: FC<ConsPatch.Props> = ({ draft, onCancel, onSettled, ...props }) => {
	const patch = withDraftFetchQuery.useSet();
	const initialCons = draft.cons ?? [];
	const paddedCons = [
		...initialCons,
		...Array(sProsCons.maxItems - initialCons.length).fill(""),
	].slice(0, sProsCons.maxItems);
	const [items, setItems] = useState<string[]>(paddedCons);

	const mutation = withDraftPatchMutation.useMutation({
		onSuccess(draft) {
			patch(() => draft, {
				where: {
					id: draft.id,
				},
			});
		},
		onSettled() {
			onSettled?.();
		},
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
			textTitle={"Listing - Cons (title)"}
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
				<Tx
					label={"Listing - Cons (message)"}
					ui={{
						text: "lg",
						opacity: "low",
						color: "text",
					}}
					className={"text-center"}
				/>

				<Container
					ui={{
						flow: "vertical",
						width: "full",
					}}
				>
					{Array.from({
						length: sProsCons.maxItems,
					}).map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Static array of 5 fields
						<FormField key={`cons-field-${index}`}>
							{(props) => (
								<TextInput
									type="text"
									value={items[index] ?? ""}
									onChange={(e) => {
										updateItem(index, e.target.value);
									}}
									maxLength={sProsCons.items.maxLength}
									{...props}
								/>
							)}
						</FormField>
					))}
				</Container>

				<SaveControl
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
				/>
			</Container>
		</TitleContainer>
	);
};
