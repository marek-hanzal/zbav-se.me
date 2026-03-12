import { useLocale } from "@use-pico/client/hook";
import type { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tTransactionEntryGallery } from "@zbav-se.me/sdk/api/user";
import { withTransactionEntryGalleryFetchQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { GalleryPreviewSheet } from "~/app/@common/gallery/ui/GalleryPreviewSheet";
import { TypeContainer } from "./TypeContainer";

export namespace Gallery {
	export interface Props extends Container.Props {
		transactionEntry: tTransactionEntryGallery;
	}
}

export const Gallery: FC<Gallery.Props> = ({ transactionEntry, ...props }) => {
	const locale = useLocale();
	const { data: gallery } = withTransactionEntryGalleryFetchQuery.useSuspenseQuery({
		where: {
			transactionEntryId: transactionEntry.id,
		},
	});
	const hero = useUpload(gallery.items);
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return (
		<TypeContainer
			direction={transactionEntry.direction}
			ui={{
				position: "relative",
				theme: undefined,
				background: undefined,
				round: undefined,
				inner: undefined,
			}}
			className={"h-48"}
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
					time: transactionEntry.createdAt,
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
		</TypeContainer>
	);
};
