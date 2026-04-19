import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ArrowLeftIcon, ArrowRightIcon, TrashIcon } from "@/lib/client/icon";
import { translator } from "@/lib/common/translator";

export namespace Toolbar {
	export interface Hooks {
		onDelete(): void;
		onMoveLeft(): void;
		onMoveRight(): void;
	}

	export interface Props extends Container.Props {
		canMoveLeft: boolean;
		canMoveRight: boolean;
		hooks: Hooks;
	}
}

export const Toolbar: FC<Toolbar.Props> = ({ canMoveLeft, canMoveRight, hooks, ...props }) => {
	return (
		<Container
			data-ui={"GalleryUpload-[Toolbar]"}
			data-ui-snap-to="top-center"
			data-ui-flow="horizontal"
			data-ui-items="center"
			data-ui-justify="center"
			data-ui-gap="default"
			data-ui-inner="xs"
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-round="default"
			data-ui-background="default"
			data-ui-border
			data-ui-shadow
			data-ui-z-index
			{...props}
		>
			<Button
				data-ui={"GalleryUpload-[ButtonMoveLeft]"}
				aria-label={translator.text("Move photo left (button)")}
				iconEnabled={ArrowLeftIcon}
				disabled={!canMoveLeft}
				iconProps={{
					"data-ui-text": "xl",
				}}
				data-ui-tone="neutral"
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
					hooks.onMoveLeft();
				}}
			/>

			<Button
				data-ui={"GalleryUpload-[ButtonDelete]"}
				aria-label={translator.text("Delete photo (button)")}
				iconEnabled={TrashIcon}
				iconProps={{
					"data-ui-text": "xl",
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
					hooks.onDelete();
				}}
			/>

			<Button
				data-ui={"GalleryUpload-[ButtonMoveRight]"}
				aria-label={translator.text("Move photo right (button)")}
				iconEnabled={ArrowRightIcon}
				disabled={!canMoveRight}
				iconProps={{
					"data-ui-text": "xl",
				}}
				data-ui-tone="neutral"
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
					hooks.onMoveRight();
				}}
			/>
		</Container>
	);
};
