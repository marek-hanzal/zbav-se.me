import { Container, type uiContainer } from "@use-pico/client/ui/container";
import type { tMessageGallery } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { match } from "ts-pattern";
import { useHeroUpload } from "~/app/gallery/hook/useHeroUpload";

export namespace MessageGallery {
	export interface Props extends Container.Props {
		message: tMessageGallery;
	}
}

export const MessageGallery: FC<MessageGallery.Props> = ({ message, ...props }) => {
	const hero = useHeroUpload(message.gallery.items);

	return (
		<Container
			ui={{
				theme: "light",
				background: "alt",
				border: true,
				shadow: true,
				inner: "default",
				round: "default",
				...match<typeof message.direction, uiContainer.Ui>(message.direction)
					.with("in", () => {
						return {
							tone: "link",
						};
					})
					.with("out", () => {
						return {
							tone: "primary",
						};
					})
					.with("system", () => {
						return {
							tone: "neutral",
						};
					})
					.exhaustive(),
			}}
			className={[
				"w-2/3",
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
				className={"h-48"}
			/>
		</Container>
	);
};
