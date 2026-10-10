import type { FC } from "react";
import { Title } from "~/application-ui/ui/title.exports";
import { CloseIcon } from "~/ui/constant/CloseIcon";
import { Container } from "~/ui/ui/Container";
import { Icon } from "~/ui/ui/Icon";

export namespace ModalContainer {
	export interface Props extends Container.Props {
		textTitle: string;
		icon?: Icon.Type;
		iconProps?: Icon.PropsEx;
		closeFn(): void;
	}
}

export const ModalContainer: FC<ModalContainer.Props> = ({
	textTitle,
	icon,
	iconProps,
	closeFn,
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
						onClick={closeFn}
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
