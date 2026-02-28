import { useLocale } from "@use-pico/client/hook";
import { ArrowRightIcon, EditIcon, Icon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { isValid } from "~/app/@common/draft/util/isValid";
import { useMaybeUpload } from "~/app/@common/gallery/hook/useMaybeUpload";
import { Image } from "./Image";
import { Title } from "./Title";

export namespace DraftItem {
	export interface Props extends Group.Props {
		draft: tDraft;
	}
}

export const DraftItem: FC<DraftItem.Props> = ({ draft, ui, className, ...props }) => {
	const locale = useLocale();
	const hero = useMaybeUpload(draft.gallery.items);

	const valid = isValid(draft);

	return (
		<LinkTo
			to={"/$locale/seller/draft/$id/edit"}
			params={{
				locale,
				id: draft.id,
			}}
		>
			<Group
				data-ui={"DraftItem[Container]"}
				data-id={draft.id}
				className={[
					"min-h-24",
					"h-24",
					"md:h-28",
					className,
				]}
				ui={{
					tone: "neutral",
					theme: "light",
					width: "full",
					background: "default",
					...ui,
				}}
				{...props}
			>
				<Container
					ui={{
						flow: "horizontal",
						position: "relative",
						height: "full",
						width: "full",
					}}
				>
					<Image
						draftId={draft.id}
						src={hero?.url}
					/>

					<Container
						className={"min-w-0 flex-1"}
						ui={{
							flow: "vertical",
							items: "start",
							justify: "space-between",
							height: "full",
							inner: "xs",
						}}
					>
						<Title title={draft.title} />

						<Typo
							label={toTimeDiff({
								locale,
								time: draft.updatedAt,
							})}
							ui={{
								tone: "neutral",
								theme: "light",
								text: "xs",
								font: "normal",
								color: "text",
								opacity: "5",
							}}
						/>
					</Container>

					<Icon
						icon={ArrowRightIcon}
						ui={{
							tone: valid.isValid ? "primary" : "neutral",
							theme: "light",
							snapTo: "right-center",
							text: "xl",
							color: "lead",
						}}
					/>

					<Container
						ui={{
							tone: valid.isValid ? "primary" : "secondary",
							theme: "light",
							round: "full",
							background: "default",
							snapTo: "bottom-left",
							flow: "vertical",
							items: "center",
							justify: "center",
							opacity: valid ? "none" : "7",
							shadow: true,
							border: true,
						}}
						className={[
							"h-7",
							"w-7",
						]}
					>
						<Icon
							icon={valid.isValid ? CheckIcon : EditIcon}
							ui={{
								tone: valid.isValid ? "primary" : "secondary",
								theme: "light",
								text: "lg",
								color: "lead",
							}}
						/>
					</Container>
				</Container>
			</Group>
		</LinkTo>
	);
};
