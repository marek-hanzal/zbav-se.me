import { useParams } from "@tanstack/react-router";
import { Button, Icon, LinkTo, ls, UserIcon } from "@use-pico/client";
import { type Cls, useCls } from "@use-pico/cls";
import { translator } from "@use-pico/common";
import { driver } from "driver.js";
import { type FC, useEffect, useId } from "react";
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
	const feedId = useId();
	const listingId = useId();
	const bagId = useId();
	const userId = useId();

	useEffect(() => {
		const intro = ls.get("intro");

		if (intro) {
			// return;
		}

		const drv = driver({
			showProgress: true,
			animate: true,
			overlayClickBehavior: "nextStep",
			stageRadius: 10,
			disableActiveInteraction: true,
			nextBtnText: translator.text("Next (tour)"),
			prevBtnText: translator.text("Previous (tour)"),
			doneBtnText: translator.text("Done (tour)"),
			progressText: translator.text("Progress (tour)"),
			steps: [
				{
					element: `#${feedId}`,
					popover: {
						title: translator.text("Feed (tour)"),
						description: translator.text("Feed (description)"),
					},
				},
				{
					element: `#${listingId}`,
					popover: {
						title: translator.text("Listing (tour)"),
						description: translator.text("Listing (description)"),
					},
				},
				{
					element: `#${bagId}`,
					popover: {
						title: translator.text("Bag (tour)"),
						description: translator.text("Bag (description)"),
					},
				},
				{
					element: `#${userId}`,
					popover: {
						title: translator.text("User (tour)"),
						description: translator.text("User (description)"),
					},
				},
			],
			onDestroyed() {
				ls.set("intro", true);
			},
		});

		drv.drive();

		return () => {
			drv.destroy();
		};
	}, [
		feedId,
		listingId,
		bagId,
		userId,
	]);

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
				id={feedId}
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
				id={listingId}
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
				id={bagId}
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
				id={userId}
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
