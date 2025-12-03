import type { EntitySchema } from "@use-pico/common/schema";
import type { ReactNode } from "react";
import { Badge } from "../badge/Badge";
import { Tx } from "../tx/Tx";
import { Container } from "./Container";
import { SpinnerContainer } from "./SpinnerContainer";

export namespace ContainerValueList {
	export interface Props<TItem extends EntitySchema.Type> extends Omit<Container.Props, "items"> {
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
		renderFn(item: TItem): ReactNode;
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
	renderFn,
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
				tone={"neutral"}
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
								"border-none",
								"gap-2",
								"px-4",
								"py-3",
							],
							token: [
								"round.default",
							],
						},
					},
				}}
			>
				<Tx
					tone={"primary"}
					label={textTitle}
					preset={"label"}
				/>

				{action}
			</Badge>

			<Container
				tone={"unset"}
				theme={"unset"}
				layout={"vertical-flex"}
				gap={"xs"}
				height={"auto"}
				round={"lg"}
				square={"md"}
			>
				{loading
					? null
					: items.map((item) => (
							<Badge
								key={item.id}
								tone={"neutral"}
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
												"round.default",
												"square.md",
											],
										},
									},
								}}
							>
								{renderFn(item)}
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
