import type { FC } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Container } from "@/lib/client/container";
import { useSelection } from "@/lib/client/selection";
import { translator } from "@/lib/common/translator";
import type { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { RestrictionSelect } from "~/common/restriction/ui/RestrictionSelect";

export namespace RestrictionSheet {
	export interface Props extends BottomSheet.Props {
		onRestriction(restriction: CategoryRestrictionEnumSchema.Type[]): Promise<any>;
		restriction: CategoryRestrictionEnumSchema.Type[];
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
		initial: restriction.map((item) => ({
			id: item,
		})),
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
							selection.set(
								restriction.map((item) => ({
									id: item,
								})),
							);
						}, 0);
					}}
					onSave={() => {
						props.onClose();
						onRestriction(
							selection.optional.multiId() as CategoryRestrictionEnumSchema.Type[],
						);
					}}
					loading={isPending}
					disabled={false}
				/>
			</Container>
		</BottomSheet>
	);
};
