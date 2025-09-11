import { useParams } from "@tanstack/react-router";
import { Button, Icon, LinkTo, UserIcon } from "@use-pico/client";
import { type Cls, useCls } from "@use-pico/cls";
import type { FC } from "react";
import { BagIcon } from "~/app/ui/icon/BagIcon";
import { FeedIcon } from "~/app/ui/icon/FeedIcon";
import { PostIcon } from "~/app/ui/icon/PostIcon";
import { NavCls } from "~/app/ui/nav/NavCls";

export namespace Nav {
	export interface Props extends NavCls.Props {
		active: "feed" | "create" | "bag" | "user";
	}
}

export const Nav: FC<Nav.Props> = ({ active, cls = NavCls, tweak }) => {
	const slots = useCls(cls, tweak);
	const { locale } = useParams({
		from: "/$locale",
	});

	const variants: Cls.VariantsOf<typeof Button.cls> = {
		size: "lg",
		tone: "secondary",
		round: "xl",
	};
	const activeTone: Cls.VariantOf<typeof Button.cls, "tone"> = "primary";

	return (
		<div className={slots.root()}>
			<LinkTo
				to={"/$locale/n/feed"}
				params={{
					locale,
				}}
				tone={"inherit"}
			>
				<Button
					{...variants}
					tone={active === "feed" ? activeTone : variants.tone}
				>
					<Icon icon={FeedIcon} />
				</Button>
			</LinkTo>

			<LinkTo
				to={"/$locale/n/create"}
				params={{
					locale,
				}}
				tone={"inherit"}
			>
				<Button
					{...variants}
					tone={active === "create" ? activeTone : variants.tone}
				>
					<Icon icon={PostIcon} />
				</Button>
			</LinkTo>

			<LinkTo
				to={"/$locale/n/bag"}
				params={{
					locale,
				}}
				tone={"inherit"}
			>
				<Button
					{...variants}
					tone={active === "bag" ? activeTone : variants.tone}
				>
					<Icon icon={BagIcon} />
				</Button>
			</LinkTo>

			<LinkTo
				to={"/$locale/n/user"}
				params={{
					locale,
				}}
				tone={"inherit"}
			>
				<Button
					{...variants}
					tone={active === "user" ? activeTone : variants.tone}
				>
					<Icon icon={UserIcon} />
				</Button>
			</LinkTo>
		</div>
	);
};
