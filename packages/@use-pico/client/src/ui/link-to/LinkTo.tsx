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
	/**
	 * Display mode of the link.
	 * @default "unset"
	 */
	display?: Cls.VariantOf<LinkToCls, "display">;
	/**
	 * Whether the link should take full width of its container.
	 * @default false
	 */
	full?: boolean;
	/**
	 * Color tone of the link (affects text, background, and border colors).
	 * @default "link"
	 */
	tone?: Cls.VariantOf<LinkToCls, "tone">;
	/**
	 * Theme variant (light or dark).
	 * @default "light"
	 */
	theme?: Cls.VariantOf<LinkToCls, "theme">;
}

const BaseLinkTo: FC<BaseLinkToProps> = ({
	icon,
	iconProps,
	iconPosition = "left",
	display,
	full,
	tone,
	theme,
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
					size={"sm"}
					{...iconProps}
				/>
			)}
			{children}
			{iconPosition === "right" && (
				<Icon
					icon={icon}
					size={"sm"}
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
