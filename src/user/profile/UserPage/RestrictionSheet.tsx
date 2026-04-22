import type { FC } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Container } from "@/lib/client/container";
import { useSelection } from "@/lib/client/selection";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { RestrictionSelect } from "~/common/restriction/ui/RestrictionSelect";

export namespace RestrictionSheet {
	export interface Props extends BottomSheet.Props {
		onRestriction(restriction: RestrictionEnumSchema.Type): Promise<any>;
		restriction: RestrictionEnumSchema.Type | undefined;
		isPending: boolean;
	}
}

export const RestrictionSheet: FC<RestrictionSheet.Props> = ({
	onRestriction,
	restriction,
	isPending,
	...props
}) => {
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
			header={() => ({
				title: translator.text("Restriction settings (title)"),
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
					onCancel={() => {
						props.onClose();
						setTimeout(() => {
							restriction &&
								selection.set(
									[
										restriction,
									].map((item) => ({
										id: item,
									})),
								);
						}, 0);
					}}
					onSave={() => {
						props.onClose();
						onRestriction(selection.optional.singleId() as RestrictionEnumSchema.Type);
					}}
					loading={isPending}
					disabled={false}
				/>
			</Container>
		</BottomSheet>
	);
};
