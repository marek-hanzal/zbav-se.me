import { useLocale } from "@use-pico/client/hook";
import { EditIcon, Icon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { isValid } from "~/app/@common/draft/util/isValid";
import { useMaybeUpload } from "~/app/@common/gallery/hook/useMaybeUpload";
import { ListItem } from "~/app/@common/list-item/ListItem";

export namespace DraftItem {
	export interface Props extends ListItem.PropsEx {
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
			<ListItem
				hero={hero}
				title={
					<Tx
						label={draft.title ?? "Draft (label)"}
						ui={{
							tone: draft.title ? "primary" : "neutral",
							theme: "light",
							color: "lead",
							font: "semibold",
							text: "sm",
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
				}
				bottom={
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
				}
				{...props}
			>
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
			</ListItem>
		</LinkTo>
	);
};
