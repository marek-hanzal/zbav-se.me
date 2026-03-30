import { Progress } from "@use-pico/client/ui/progress";
import { translator } from "@use-pico/common/translator";
import { type FC, Suspense } from "react";
import { Container } from "@/lib/client/container";
import { SpinnerIcon } from "@/lib/client/icon";
import { Status } from "@/lib/client/status";
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

const UploadPending: FC<{
	progress: number;
}> = ({ progress }) => {
	return (
		<Container
			data-ui={"PhotoUpload-[Container.spinner]"}
			ui={{
				flow: "vertical",
				height: "full",
				items: "center",
				justify: "center",
			}}
		>
			<Status
				data-ui={"PhotoUpload-[Status.spinner]"}
				icon={SpinnerIcon}
				textTitle={translator.text("Uploading photo (title)")}
				action={
					<Progress
						value={progress * 100}
						size={"lg"}
						tone={"primary"}
						theme={"dark"}
					/>
				}
				ui={{
					tone: "primary",
					theme: "light",
				}}
			/>
		</Container>
	);
};

/**
 * Coordinates photo file input and upload-ready state for the parent form.
 * Use it in editors where users attach media before publishing or saving.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
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

			{controller.isPending ? <UploadPending progress={controller.progress} /> : null}

			{!value && !controller.isPending ? <Placeholder disabled={ui?.disabled} /> : null}

			{value && !controller.isPending ? (
				<Suspense fallback={<Preview.Fallback />}>
					<Preview
						_suspense={"I know"}
						uploadId={value}
					/>
				</Suspense>
			) : null}
		</Container>
	);
};
