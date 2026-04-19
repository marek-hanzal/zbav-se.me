import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { TrashIcon } from "@/lib/client/icon";
import { translator } from "@/lib/common/translator";

export namespace Toolbar {
	export interface Props extends Container.Props {
		onDelete(): void;
	}
}

export const Toolbar: FC<Toolbar.Props> = ({ onDelete, ...props }) => {
	return (
		<Container
			data-ui={"GalleryUpload-[Container.toolbar]"}
			data-ui-snap-to="top-center"
			data-ui-flow="horizontal"
			data-ui-items="center"
			data-ui-justify="center"
			data-ui-gap="xs"
			data-ui-inner="xs"
			data-ui-tone="danger"
			data-ui-theme="light"
			data-ui-round="default"
			data-ui-background="default"
			data-ui-border
			data-ui-shadow
			data-ui-z-index
			{...props}
		>
			<Button
				data-ui={"GalleryUpload-[Button.delete]"}
				aria-label={translator.text("Delete photo (button)")}
				iconEnabled={TrashIcon}
				iconProps={{
					"data-ui-text": "lg",
				}}
				data-ui-tone="danger"
				data-ui-theme="light"
				data-ui-square="sm"
				data-ui-round="default"
				data-ui-justify="center"
				data-ui-items="center"
				data-ui-background={undefined}
				data-ui-border={undefined}
				data-ui-shadow={undefined}
				onClick={(event) => {
					event.stopPropagation();
					onDelete();
				}}
			/>
		</Container>
	);
};
