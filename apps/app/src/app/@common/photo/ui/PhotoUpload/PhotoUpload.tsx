import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { Pending } from "./Pending";
import { Placeholder } from "./Placeholder";
import { Preview } from "./Preview";
import { useController } from "./useController";

export namespace PhotoUpload {
	export type Value = string | undefined;
	export type OnChangeFn = (uploadId: Value) => void;

	export interface Props extends Omit<Container.Props, "onChange"> {
		camera?: boolean;
		value: Value;
		onChange: OnChangeFn;
	}
}

export const PhotoUpload: FC<PhotoUpload.Props> = ({
	camera = false,
	value,
	onChange,
	ui,
	...props
}) => {
	const controller = useController({
		value,
		onChange,
	});

	return (
		<Container
			data-ui={"PhotoUpload[Container]"}
			ui={{
				tone: "neutral",
				theme: "light",
				round: "default",
				background: "default",
				border: true,
				shadow: true,
				position: "relative",
				disabled: controller.isPending ?? undefined,
				width: "full",
				height: "full",
				...ui,
			}}
			onClick={controller.pick}
			onKeyDown={controller.onKeyDown}
			{...props}
		>
			<input
				data-ui="PhotoUpload-[Input]"
				ref={controller.inputRef}
				type="file"
				accept="image/*"
				capture={camera ? "environment" : undefined}
				className="sr-only"
				onChange={controller.onUpload}
			/>

			{controller.isPending ? <Pending progress={controller.progress} /> : null}

			{!value && !controller.isPending ? <Placeholder disabled={ui?.disabled} /> : null}

			{value && !controller.isPending ? <Preview uploadId={value} /> : null}
		</Container>
	);
};
