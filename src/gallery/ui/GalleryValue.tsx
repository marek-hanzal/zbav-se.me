import type { FC } from "react";
import { PhotoIcon } from "~/application-ui/constant/icon.exports";
import { HeroImage } from "~/application-ui/ui/img.exports";
import { getMaybeUploadFn } from "~/gallery/fn/getMaybeUploadFn";
import { Container } from "~/ui/ui/Container";
import { Status } from "~/ui/ui/Status";

export namespace GalleryValue {
	export interface Props extends Container.Props {
		urls: string[];
		label: string;
		statusProps?: Status.Props;
	}
}

/**
 * Displays a read-only gallery value with hero-image preview and a fallback status when no photos are present.
 * Use it in summaries and detail cards where users need a quick visual check of current gallery state.
 */
export const GalleryValue: FC<GalleryValue.Props> = ({ urls, label, statusProps, ...props }) => {
	const hero = getMaybeUploadFn(urls);

	return (
		<Container
			data-ui={"GalleryValue"}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-round={undefined}
			data-ui-width="full"
			data-ui-flow="horizontal"
			data-ui-items="center"
			data-ui-justify="center"
			data-ui-background="default"
			data-ui-shadow={false}
			data-ui-border={false}
			className="h-42"
			{...props}
		>
			{hero ? (
				<HeroImage
					src={hero}
					data-ui-round="default"
				/>
			) : null}

			{hero ? null : (
				<Status
					data-ui={"GalleryValue-[Status.photo-hint]"}
					icon={PhotoIcon}
					iconProps={{
						"data-ui-text": "3xl",
					}}
					textTitle={label}
					titleProps={{
						"data-ui-font": "normal",
						"data-ui-text": "lg",
					}}
					data-ui-tone={urls.length > 0 ? "neutral" : "primary"}
					data-ui-theme="light"
					data-ui-text="default"
					{...statusProps}
				/>
			)}
		</Container>
	);
};
