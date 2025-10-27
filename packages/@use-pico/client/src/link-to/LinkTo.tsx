import { createLink, type LinkComponent } from "@tanstack/react-router";
import { type Cls, useCls, VariantProvider } from "@use-pico/cls";
import type { AnchorHTMLAttributes, ComponentProps, FC, Ref } from "react";
import { PicoCls } from "../cls/PicoCls";
import { Icon } from "../icon/Icon";
import { LinkToCls } from "./LinkToCls";

interface BaseLinkToProps
	extends LinkToCls.Props<AnchorHTMLAttributes<HTMLAnchorElement>> {
	ref?: Ref<HTMLAnchorElement>;
	icon?: Icon.Type;
	iconProps?: Icon.PropsEx;
	display?: Cls.VariantOf<LinkToCls, "display">;
	tone?: Cls.VariantOf<LinkToCls, "tone">;
	theme?: Cls.VariantOf<LinkToCls, "theme">;
}

const BaseLinkTo: FC<BaseLinkToProps> = ({
	ref,
	icon,
	iconProps,
	display,
	tone,
	theme,
	cls = LinkToCls,
	tweak,
	children,
	...props
}) => {
	const { slots, variant } = useCls(cls, tweak, {
		variant: {
			display,
			tone,
			theme,
		},
	});

	return (
		<VariantProvider
			cls={PicoCls}
			variant={variant}
		>
			<a
				{...props}
				ref={ref}
				data-ui="LinkTo-root"
				className={slots.root()}
			>
				<Icon
					icon={icon}
					size={"sm"}
					{...iconProps}
				/>
				{children}
			</a>
		</VariantProvider>
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
