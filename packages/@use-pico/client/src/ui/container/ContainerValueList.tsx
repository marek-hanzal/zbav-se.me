import type { EntitySchema } from "@use-pico/common/schema";
import type { ReactNode } from "react";
import { Badge } from "../badge/Badge";
import { Tx } from "../tx/Tx";
import { Container } from "./Container";
import { SpinnerContainer } from "./SpinnerContainer";

export namespace ContainerValueList {
	export interface Props<TItem extends EntitySchema.Type> extends Container.Props {
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
	...props
}: ContainerValueList.Props<TItem>) => {
	return (
		<Container
			tone={"unset"}
			theme={"unset"}
			height={"auto"}
			round={"lg"}
			{...props}
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
								"border-none",
								"bg-transparent",
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
				tone={"unset"}
				theme={"unset"}
				layout={"vertical-flex"}
				square={"xs"}
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
												"border-none",
												"gap-0",
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

				{loading && (
					<SpinnerContainer
						height={"content"}
						size="md"
					/>
				)}

				{!loading && items.length === 0 && <Tx label={textEmpty} />}
			</Container>
		</Container>
	);
};
