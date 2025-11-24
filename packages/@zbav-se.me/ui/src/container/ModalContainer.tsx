import { CloseIcon, Icon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { VariantProvider } from "@use-pico/cls";
import type { FC } from "react";
import { ThemeCls } from "../cls";
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
		<VariantProvider
			cls={ThemeCls}
			variant={{
				tone: "unset",
				theme: "unset",
			}}
		>
			<Container
				layout={"vertical-header-content"}
				square={"md"}
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

				<Container scroll={"vertical"}>{children}</Container>
			</Container>
		</VariantProvider>
	);
};
