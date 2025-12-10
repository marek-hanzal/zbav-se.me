import { createLink, type LinkComponent } from "@tanstack/react-router";
import type { Cls } from "@use-pico/cls";
import type { ComponentProps, FC } from "react";
import { Icon } from "../../icon/Icon";
import type { LinkToCls } from "./LinkToCls";

interface BaseLinkToProps extends ComponentProps<"a"> {
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
	iconPosition?: Cls.VariantOf<LinkToCls, "icon-position">;
}

const BaseLinkTo: FC<BaseLinkToProps> = ({
	icon,
	iconProps,
	iconPosition = "left",
	children,
	...props
}) => {
	return (
		<a
			data-root={"LinkTo"}
			{...props}
		>
			{iconPosition === "left" && (
				<Icon
					icon={icon}
					{...iconProps}
				/>
			)}

			{children}

			{iconPosition === "right" && (
				<Icon
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
	return <CreateLinkTo {...props} />;
};
