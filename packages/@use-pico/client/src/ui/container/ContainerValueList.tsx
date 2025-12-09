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
	ui,
	...props
}: ContainerValueList.Props<TItem>) => {
	return (
		<Container
			data-root="ContainerValueList"
			ui={{
				layout: "vertical-flex",
				gap: "xs",
				height: "auto",
				...ui,
			}}
			{...props}
		>
			<Badge
				data-ui="ContainerValueList-Badge-title-wrapper"
				ui={{
					tone: "neutral",
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
				data-ui="ContainerValueList-Container-content"
				ui={{
					layout: "vertical-flex",
					gap: "xs",
					height: "auto",
				}}
			>
				{loading
					? null
					: items.map((item) => (
							<Badge
								data-ui="ContainerValueList-Badge-item"
								key={item.id}
								ui={{
									tone: "neutral",
								}}
							>
								{renderFn(item)}
							</Badge>
						))}

				{loading && (
					<SpinnerContainer
						size={"md"}
						ui={{
							height: "content",
						}}
					/>
				)}

				{!loading && items.length === 0 && (
					<Badge
						data-ui="ContainerValueList-Badge-empty"
						ui={{
							tone: "neutral",
						}}
					>
						<Tx label={textEmpty} />
					</Badge>
				)}
			</Container>
		</Container>
	);
};
