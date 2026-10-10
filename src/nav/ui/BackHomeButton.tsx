import { createLink, type LinkComponent } from "@tanstack/react-router";
import type { ComponentProps, FC } from "react";
import { uiBackButtonFn } from "~/application-ui/fn/ui.exports";
import { ArrowLeftIcon } from "~/ui/constant/ArrowLeftIcon";
import { Icon } from "~/ui/ui/Icon";

export namespace BackHomeButton {
	export interface Props extends ComponentProps<typeof BackHomeButton> {
		//
	}
}

const BaseBackHomeButton: FC<uiBackButtonFn.Component<ComponentProps<"a">>> = ({
	className,
	...props
}) => {
	return (
		<a
			data-root={"BackHomeButton"}
			data-action={"go back home"}
			{...uiBackButtonFn({
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
