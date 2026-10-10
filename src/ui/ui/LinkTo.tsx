import { createLink, type LinkComponent } from "@tanstack/react-router";
import type { ComponentProps, FC } from "react";
import { uiLinkToFn } from "~/ui/fn/uiLinkToFn";
import { Icon } from "~/ui/ui/Icon";

interface BaseLinkToProps extends uiLinkToFn.Component<ComponentProps<"a">> {
	/**
	 * Icon to display in the link.
	 */
	icon?: Icon.Type;
	/**
	 * Additional props to pass to the icon component.
	 */
	iconProps?: Icon.PropsEx;
	/**
	 * Position of the icon relative to the content.
	 * @default "left"
	 */
	iconPosition?: "left" | "right";
}

const BaseLinkTo: FC<BaseLinkToProps> = ({
	icon,
	iconProps,
	iconPosition = "left",
	children,
	className,
	...props
}) => {
	return (
		<a
			data-root={"LinkTo"}
			{...uiLinkToFn({
				className,
			})}
			{...props}
		>
			{iconPosition === "left" && (
				<Icon
					data-ui="LinkTo-[Icon.left]"
					icon={icon}
					{...iconProps}
				/>
			)}

			{children}

			{iconPosition === "right" && (
				<Icon
					data-ui="LinkTo-[Icon.right]"
					icon={icon}
					{...iconProps}
				/>
			)}
		</a>
	);
};

const CreateLinkTo = createLink(BaseLinkTo);

export namespace LinkTo {
	export type Props = ComponentProps<typeof LinkTo>;
}

export const LinkTo: LinkComponent<typeof BaseLinkTo> = (props) => {
	return (
		<CreateLinkTo
			preload={"intent"}
			{...props}
		/>
	);
};
