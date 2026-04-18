import { createLink, type LinkComponent } from "@tanstack/react-router";
import type { ComponentProps, FC } from "react";
import { ArrowLeftIcon, Icon } from "@/lib/client/icon";
import { uiBackButton } from "~/common/ui/ui";

export namespace BackHomeButton {
	export interface Props extends ComponentProps<typeof BackHomeButton> {
		//
	}
}

const BaseBackHomeButton: FC<uiBackButton.Component<ComponentProps<"a">>> = ({
	className,
	...props
}) => {
	return (
		<a
			data-root={"BackHomeButton"}
			data-action={"go back home"}
			{...uiBackButton({
				className,
			})}
			{...props}
		>
			<Icon icon={ArrowLeftIcon} />
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
