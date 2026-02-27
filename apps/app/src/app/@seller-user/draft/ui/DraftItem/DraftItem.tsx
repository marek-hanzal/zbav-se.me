import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { tvc } from "@use-pico/cls";
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
					}}
				>
					<Title title={draft.title} />
				</Container>
			</LinkTo>
		</Container>
	);
};
