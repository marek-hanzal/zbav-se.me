import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";
import { useMaybeUpload } from "~/app/@common/gallery/hook/useMaybeUpload";
import { Image } from "./Image";
import { Title } from "./Title";

export namespace DraftItem {
	export interface Props extends Container.Props {
		draft: tDraft;
	}
}

export const DraftItem: FC<DraftItem.Props> = ({ draft, ui, className, ...props }) => {
	const locale = useLocale();
	const hero = useMaybeUpload(draft.gallery.items);

	return (
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
			<LinkTo
				to={"/$locale/seller/draft/$id/edit"}
				params={{
					locale,
					id: draft.id,
				}}
				ui={{
					flow: "horizontal",
					items: "start",
					width: "full",
					height: "full",
				}}
			>
				<Image
					draftId={draft.id}
					src={hero?.url}
				/>

				<Container
					className={"min-w-0 flex-1"}
					ui={{
						layout: "vertical-flex",
						items: "start",
						justify: "start",
						inner: "xs",
					}}
				>
					<Title title={draft.title} />
				</Container>
			</LinkTo>
		</Group>
	);
};
