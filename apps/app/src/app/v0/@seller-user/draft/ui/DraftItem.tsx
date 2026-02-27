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
import { useMaybeUpload } from "~/app/@common/gallery/hook/useMaybeUpload";

export namespace DraftItem {
	export interface Props extends Omit<Badge.Props, "children"> {
		draft: tDraft;
	}
}

export const DraftItem: FC<DraftItem.Props> = ({ draft, ui, className, ...props }) => {
	const locale = useLocale();
	const hero = useMaybeUpload(draft.gallery.items);

	return (
		<Container
			data-ui={"DraftItem[Container]"}
			data-id={draft.id}
			className={tvc([
				"h-24 md:h-28",
				className,
			])}
			ui={{
				tone: "secondary",
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
					flow: "horizontal",
					items: "start",
					gap: "md",
					width: "full",
					height: "full",
					inner: "sm",
				}}
			>
				<Container
					className={"aspect-square h-full shrink-0 overflow-hidden"}
					ui={{
						round: "md",
					}}
				>
					{hero ? (
						<HeroImage
							data-ui={"DraftItem-[HeroImage]"}
							src={hero.url}
							alt={`Hero image for draft ${draft.id}`}
							visible
							ui={{
								width: "full",
								height: "full",
							}}
						/>
					) : (
						<Container
							ui={{
								tone: "subtle",
								theme: "light",
								width: "full",
								height: "full",
								flow: "horizontal",
								items: "center",
								justify: "center",
								background: "default",
							}}
						>
							<Icon
								icon={ChevronRightIcon}
								ui={{
									text: "2xl",
									color: "text",
									opacity: "6",
								}}
							/>
						</Container>
					)}
				</Container>

				<Container
					className={"min-w-0 flex-1"}
					ui={{
						layout: "vertical-flex",
						items: "start",
						justify: "start",
					}}
				>
					<Badge
						ui={{
							tone: "neutral",
							theme: "light",
							inner: "sm",
							round: "md",
						}}
						className={"h-fit max-w-full min-w-0 overflow-hidden"}
					>
						{draft.title ? (
							<Tx
								label={draft.title}
								ui={{
									tone: "brand",
									theme: "light",
									color: "lead",
									font: "bold",
									display: "block",
									width: "full",
									truncate: true,
								}}
								className={[
									"block",
									"w-full",
									"max-w-full",
									"min-w-0",
								]}
							/>
						) : (
							<Tx
								label="Draft (label)"
								ui={{
									tone: "neutral",
									theme: "light",
									color: "lead",
									font: "bold",
									display: "block",
									width: "full",
									truncate: true,
								}}
								className={[
									"block",
									"w-full",
									"max-w-full",
									"min-w-0",
								]}
							/>
						)}
					</Badge>
				</Container>
			</LinkTo>
		</Container>
	);
};
