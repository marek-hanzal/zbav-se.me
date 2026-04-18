import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { CloseIcon, Icon } from "@/lib/client/icon";
import { Title } from "../title";

export namespace ModalContainer {
	export interface Props extends Container.Props {
		textTitle: string;
		icon?: Icon.Type;
		iconProps?: Icon.PropsEx;
		close(): void;
	}
}

export const ModalContainer: FC<ModalContainer.Props> = ({
	textTitle,
	icon,
	iconProps,
	close,
	children,
	...props
}) => {
	return (
		<Container
			ui={{
				layout: "vertical-header-content",
				inner: "default",
				...ui,
			}}
			{...props}
		>
			<Title
				left={
					<Icon
						icon={icon}
						{...iconProps}
					/>
				}
				right={
					<Icon
						icon={CloseIcon}
						onClick={close}
					/>
				}
				textTitle={textTitle}
			/>

			<Container
				data-ui="ModalContainer-content"
				ui={{
					scroll: "vertical",
				}}
			>
				{children}
			</Container>
		</Container>
	);
};
