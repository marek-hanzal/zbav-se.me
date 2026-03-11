import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";

export namespace ListingTransactionHero {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const ListingTransactionHero: FC<ListingTransactionHero.Props> = ({
	transaction,
	ui,
	...props
}) => {
	const hero = useUpload(transaction.gallery.items);

	return (
		<Container
			data-ui="ListingTransactionHero[Container]"
			ui={{
				position: "relative",
				height: "content",
				...ui,
			}}
			{...props}
		>
			<HeroImage
				data-ui="ListingTransactionHero-[Image]"
				src={hero.url}
				alt={`Hero image for listing ${transaction.id}`}
				className={"h-42"}
			/>

			<Container
				data-ui="ListingTransactionHero-[TitleOverlay]"
				ui={{
					inner: "sm",
				}}
				className={[
					"pointer-events-none",
					"absolute",
					"inset-x-0",
					"bottom-0",
					"bg-gradient-to-t",
					"from-black/80",
					"via-black/50",
					"to-transparent",
				]}
			>
				<Typo
					label={transaction.title}
					ui={{
						font: "bold",
					}}
					className={[
						"line-clamp-2",
						"text-white",
					]}
				/>
			</Container>
		</Container>
	);
};
