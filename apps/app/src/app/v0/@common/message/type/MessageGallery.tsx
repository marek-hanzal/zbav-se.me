import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tMessageGallery } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { useHeroUpload } from "~/app/v0/@common/gallery/hook/useHeroUpload";
import { GallerySheet } from "~/app/v0/@common/gallery/ui/GallerySheet";

export namespace MessageGallery {
	export interface Props extends Container.Props {
		message: tMessageGallery;
	}
}

export const MessageGallery: FC<MessageGallery.Props> = ({ message, ...props }) => {
	const locale = useLocale();
	const hero = useHeroUpload(message.gallery.items);
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return (
		<Container
			ui={{
				position: "relative",
			}}
			className={[
				"w-2/3",
				"h-48",
				message.direction === "in" ? [] : undefined,
				message.direction === "out"
					? [
							"ml-auto",
						]
					: undefined,
				message.direction === "system"
					? [
							"mx-auto",
							"text-center",
						]
					: undefined,
			]}
			{...props}
		>
			<HeroImage
				src={hero.url}
				visible
				ui={{
					theme: "light",
					background: "alt",
					round: "default",
				}}
				onClick={() => setIsGalleryOpen((prev) => !prev)}
			/>

			<Typo
				label={toTimeDiff({
					locale,
					time: message.createdAt,
					type: "relative",
				})}
				ui={{
					tone: "neutral",
					theme: "light",
					background: "default",
					text: "sm",
					round: "default",
					inner: "default",
					opacity: "low",
					snapTo: "bottom-left",
				}}
			/>

			<GallerySheet
				uploads={message.gallery.items.map((item) => item.upload)}
				isOpen={isGalleryOpen}
				onClose={() => setIsGalleryOpen(false)}
			/>
		</Container>
	);
};
