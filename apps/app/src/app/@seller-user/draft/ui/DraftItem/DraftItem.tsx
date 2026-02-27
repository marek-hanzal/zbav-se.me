import { useLocale } from "@use-pico/client/hook";
import { ArrowRightIcon, EditIcon, Icon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { type tDraft, zListingCreate } from "@zbav-se.me/sdk/api/seller-user";
import { CheckIcon } from "@zbav-se.me/ui/icon";
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

	const pass = zListingCreate.safeParse({
		...draft,
		uploadIds: draft.gallery.items.map((item) => item.uploadId),
		draftId: draft.id,
	});

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
					position: "relative",
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

				<Icon
					icon={ArrowRightIcon}
					ui={{
						tone: pass.success ? "primary" : "neutral",
						theme: "light",
						snapTo: "right-center",
						text: "xl",
						color: "lead",
					}}
				/>

				<Container
					ui={{
						tone: pass.success ? "primary" : "secondary",
						theme: "light",
						round: "full",
						background: "default",
						snapTo: "bottom-left",
						flow: "vertical",
						items: "center",
						justify: "center",
						opacity: pass.success ? "none" : "7",
						shadow: true,
						border: true,
					}}
					className={[
						"h-7",
						"w-7",
					]}
				>
					<Icon
						icon={pass.success ? CheckIcon : EditIcon}
						ui={{
							tone: pass.success ? "primary" : "secondary",
							theme: "light",
							text: "lg",
							color: "lead",
						}}
					/>
				</Container>
			</LinkTo>
		</Group>
	);
};
