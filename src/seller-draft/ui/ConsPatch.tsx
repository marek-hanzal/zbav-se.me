import { type FC, useState } from "react";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { EditAction } from "~/application-ui/ui/EditAction";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { FormField } from "~/form/ui/FormField";
import { ProsConsSchema } from "~/listing/schema/ProsConsSchema";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller-draft/schema/DraftSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { Container } from "~/ui/ui/Container";
import { TextInput } from "~/ui/ui/TextInput";
import type { useView } from "~/view/hook/useView";

const PROS_CONS_MAX_ITEMS = 5;
const PROS_CONS_ITEM_MAX_LENGTH = 72;

export namespace ConsPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancelFn(): void;
		view: useView.Use<"warranty">;
	}
}

export const ConsPatch: FC<ConsPatch.Props> = ({ draft, onCancelFn, view, ...props }) => {
	const translator = useTranslator();
	const initialCons = draft.cons;
	const paddedCons = [
		...initialCons,
		...Array(PROS_CONS_MAX_ITEMS - initialCons.length).fill(""),
	].slice(0, PROS_CONS_MAX_ITEMS);
	const [items, setItemsFn] = useState<string[]>(paddedCons);

	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			view.setFn("warranty");
		},
		invalidate: [
			"collection",
		],
	});

	const updateItemFn = (index: number, value: string) => {
		const updated = [
			...items,
		];
		updated[index] = value.slice(0, PROS_CONS_ITEM_MAX_LENGTH);
		setItemsFn(updated);
	};

	return (
		<TitleContainer
			data-ui={"ConsPatch"}
			textTitle={translator.textFn("Listing - Cons (title)")}
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
										updateItemFn(index, e.target.value);
									}}
									maxLength={PROS_CONS_ITEM_MAX_LENGTH}
									placeholder={translator.textFn(`Cons ${index} (placeholder)`)}
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
					onCancelFn={onCancelFn}
					onSaveFn={() => {
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
