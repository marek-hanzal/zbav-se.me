import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tTransactionEntryGallery } from "@zbav-se.me/sdk/api/user";
import { withGalleryFetchQuery } from "@zbav-se.me/sdk/query/user/gallery";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { useUser } from "~/app/@common/auth/hook/useUser";
import { GalleryPreviewSheet } from "~/app/@common/gallery/ui/GalleryPreviewSheet";

export namespace TransactionEntryGallery {
	export interface Props extends Container.Props {
		message: tTransactionEntryGallery;
	}
}

export const TransactionEntryGallery: FC<TransactionEntryGallery.Props> = ({
	message,
	...props
}) => {
	const locale = useLocale();
	const user = useUser();
	const direction =
		message.userId === null ? "system" : message.userId === user.id ? "out" : "in";
	const { data: gallery } = withGalleryFetchQuery.useSuspenseQuery({
		where: {
			id: message.payload.galleryId,
		},
	});
	const hero = useUpload(gallery.items);
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return (
		<Container
			ui={{
				position: "relative",
			}}
			className={[
				"w-2/3",
				"h-48",
				direction === "in" ? [] : undefined,
				direction === "out"
					? [
							"ml-auto",
						]
					: undefined,
				direction === "system"
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
					opacity: "8",
					snapTo: "bottom-left",
				}}
			/>

			<GalleryPreviewSheet
				uploads={gallery.items.map((item) => item.upload)}
				isOpen={isGalleryOpen}
				onClose={() => setIsGalleryOpen(false)}
			/>
		</Container>
	);
};
