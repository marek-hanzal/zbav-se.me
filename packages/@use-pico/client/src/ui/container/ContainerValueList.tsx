import type { EntitySchema } from "@use-pico/common/schema";
import type { ReactNode } from "react";
import { Icon, SpinnerIcon } from "../../icon";
import { Badge } from "../badge/Badge";
import { Tx } from "../tx/Tx";
import { Container } from "./Container";

export namespace ContainerValueList {
	export interface Props<TItem extends EntitySchema.Type> {
		/**
		 * Translation label for the list title.
		 */
		textTitle: string;
		/**
		 * Translation label for the empty state.
		 */
		textEmpty: string;
		/**
		 * Array of items to display.
		 */
		items: TItem[];
		/**
		 * Function to render each item.
		 */
		render: (item: TItem) => ReactNode;
		/**
		 * Action element to display next to the title.
		 */
		action?: ReactNode;
		loading?: boolean;
	}
}

export const ContainerValueList = <TItem extends EntitySchema.Type>({
	textTitle,
	textEmpty,
	items,
	render,
	action,
	loading,
}: ContainerValueList.Props<TItem>) => {
	return (
		<Container
			tone={"primary"}
			theme={"light"}
			height={"auto"}
			round={"lg"}
			border={"default"}
		>
			<Badge
				theme={"light"}
				tweak={{
					slot: {
						root: {
							class: [
								"flex",
								"flex-row",
								"items-center",
								"justify-between",
								"h-fit",
								"w-full",
								"border-t-0",
								"border-l-0",
								"border-r-0",
								"rounded-none",
							],
							token: [
								"square.md",
							],
						},
					},
				}}
			>
				<Tx
					label={textTitle}
					preset={"label"}
				/>

				{action}
			</Badge>

			<Container
				layout={"vertical-flex"}
				gap={"sm"}
				square={"sm"}
				height={"auto"}
				round={"lg"}
			>
				{loading
					? null
					: items.map((item) => (
							<Badge
								key={item.id}
								tone={"secondary"}
								theme={"light"}
								tweak={{
									slot: {
										root: {
											class: [
												"flex",
												"flex-col",
												"items-start",
												"h-fit",
												"w-full",
											],
											token: [
												"round.md",
												"square.md",
											],
										},
									},
								}}
							>
								{render(item)}
							</Badge>
						))}

				{loading && <Icon icon={SpinnerIcon} />}

				{!loading && items.length === 0 && <Tx label={textEmpty} />}
			</Container>
		</Container>
	);
};
