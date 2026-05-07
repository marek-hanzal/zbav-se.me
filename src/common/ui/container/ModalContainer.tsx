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
			data-ui-layout="vertical-header-content"
			data-ui-inner="default"
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
				data-ui-scroll="vertical"
			>
				{children}
			</Container>
		</Container>
	);
};
