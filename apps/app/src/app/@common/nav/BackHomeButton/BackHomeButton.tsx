import { createLink, type LinkComponent } from "@tanstack/react-router";
import { ArrowLeftIcon, Icon } from "@use-pico/client/icon";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import type { ComponentProps, FC } from "react";

export namespace BackHomeButton {
	export interface Props extends ComponentProps<typeof BackHomeButton> {
		//
	}
}

const BaseBackHomeButton: FC<uiBackButton.Component<ComponentProps<"a">>> = ({
	ui,
	className,
	...props
}) => {
	return (
		<a
			data-root={"BackHomeButton"}
			{...uiBackButton({
				ui,
				className,
			})}
			{...props}
		>
			<Icon
				data-ui={"BackHomeButton-[Icon]"}
				icon={ArrowLeftIcon}
			/>
		</a>
	);
};

const CreateBackHomeButton = createLink(BaseBackHomeButton);

export const BackHomeButton: LinkComponent<typeof BaseBackHomeButton> = (props) => {
	return (
		<CreateBackHomeButton
			preload={"intent"}
			{...props}
		/>
	);
};
