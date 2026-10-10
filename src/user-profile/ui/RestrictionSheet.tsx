import type { FC } from "react";
import { SaveContainer } from "~/container/ui/SaveContainer";
import type { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import { RestrictionSelect } from "~/restriction/ui/RestrictionSelect/index";
import { useSelection } from "~/selection/hook/useSelection";
import { useTranslator } from "~/translation/hook/useTranslator";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { Container } from "~/ui/ui/Container";

export namespace RestrictionSheet {
	export interface Props extends BottomSheet.Props {
		onRestrictionFn(restriction: RestrictionEnumSchema.Type): Promise<any>;
		restriction: RestrictionEnumSchema.Type | undefined;
		isPending: boolean;
	}
}

export const RestrictionSheet: FC<RestrictionSheet.Props> = ({
	onRestrictionFn,
	restriction,
	isPending,
	...props
}) => {
	const translator = useTranslator();
	const selection = useSelection({
		mode: "single",
		initial: restriction
			? [
					restriction,
				].map((item) => ({
					id: item,
				}))
			: undefined,
		deps: [
			restriction,
		],
	});

	return (
		<BottomSheet
			headerFn={() => ({
				title: translator.textFn("Restriction settings (title)"),
			})}
			{...props}
		>
			<Container
				data-ui-layout={"vertical-content-footer"}
				data-ui-height={"full"}
				data-ui-inner={"default"}
				data-ui-gap={"default"}
			>
				<RestrictionSelect selection={selection} />

				<SaveContainer
					onCancelFn={() => {
						props.onClose();
						setTimeout(() => {
							restriction &&
								selection.setFn(
									[
										restriction,
									].map((item) => ({
										id: item,
									})),
								);
						}, 0);
					}}
					onSaveFn={() => {
						props.onClose();
						onRestrictionFn(
							selection.optional.singleIdFn() as RestrictionEnumSchema.Type,
						);
					}}
					loading={isPending}
					disabled={false}
				/>
			</Container>
		</BottomSheet>
	);
};
