import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { tvc } from "@use-pico/cls";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { useMaybeHeroUpload } from "~/app/@common/gallery/hook/useMaybeHeroUpload";

export namespace DraftItem {
	export interface Props extends Omit<Badge.Props, "children"> {
		draft: tDraft;
	}
}

export const DraftItem: FC<DraftItem.Props> = ({ draft, ui, className, ...props }) => {
	const locale = useLocale();
	const hero = useMaybeHeroUpload(draft.gallery.items);

	return (
		<Container
			data-ui={"DraftItem[Container]"}
			data-id={draft.id}
			className={tvc([
				"h-48 md:h-92",
				className,
			])}
			ui={{
				tone: "secondary",
				position: "relative",
				round: "lg",
				width: "full",
				size: undefined,
				shadow: true,
				...ui,
			}}
			{...props}
		>
			<LinkTo
				to={"/$locale/seller/draft/$id/edit"}
				params={{
					locale,
					id: draft.id,
				}}
				ui={{
					height: "full",
				}}
			>
				{hero ? (
					<HeroImage
						data-ui={"DraftItem-[HeroImage]"}
						src={hero.url}
						alt={`Hero image for draft ${draft.id}`}
						visible
						ui={{
							round: "lg",
							width: "full",
						}}
					/>
				) : (
					<Container
						ui={{
							tone: "subtle",
							theme: "light",
							width: "full",
							height: "full",
							round: "lg",
							flow: "horizontal",
							items: "center",
							justify: "center",
							background: "default",
							position: "relative",
						}}
					>
						<Icon
							icon={ChevronRightIcon}
							ui={{
								text: "3xl",
								color: "text",
								opacity: "6",
								snapTo: "right-center",
							}}
						/>
					</Container>
				)}
			</LinkTo>

			<Badge
				ui={{
					tone: "neutral",
					theme: "light",
					inner: "default",
					snapTo: "bottom",
					round: "md",
				}}
				className={"h-fit text-center"}
			>
				{draft.title ? (
					<Tx
						label={draft.title}
						ui={{
							tone: "brand",
							theme: "light",
							color: "lead",
							font: "bold",
							truncate: true,
						}}
					/>
				) : (
					<Tx
						label="Draft (label)"
						ui={{
							tone: "neutral",
							theme: "light",
							color: "lead",
							font: "bold",
							truncate: true,
						}}
					/>
				)}
			</Badge>
		</Container>
	);
};
