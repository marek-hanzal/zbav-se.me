import { type FC, Suspense } from "react";
import { Container } from "@/lib/client/container";
import { SpinnerIcon } from "@/lib/client/icon";
import { Progress } from "@/lib/client/progress";
import { Status } from "@/lib/client/status";
import { translator } from "@/lib/common/translator";
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
			data-ui-flow="vertical"
			data-ui-height="full"
			data-ui-items="center"
			data-ui-justify="center"
		>
			<Status
				data-ui={"PhotoUpload-[Status.spinner]"}
				icon={SpinnerIcon}
				textTitle={translator.text("Uploading photo (title)")}
				action={
					<Progress
						value={progress * 100}
						data-ui-size="lg"
						data-ui-tone="primary"
						data-ui-theme="dark"
					/>
				}
				data-ui-tone="primary"
				data-ui-theme="light"
			/>
		</Container>
	);
};

/**
 * Coordinates photo file input and upload-ready state for the parent form.
 * Use it in editors where users attach media before publishing or saving.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const PhotoUpload: FC<PhotoUpload.Props> = ({
	camera = false,
	value,
	onChange,
	...props
}) => {
	const controller = useController({
		value,
		onChange,
	});

	return (
		<Container
			data-ui={"PhotoUpload[Container]"}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-round="default"
			data-ui-background="default"
			data-ui-border
			data-ui-shadow
			data-ui-position="relative"
			data-ui-disabled={controller.isPending ?? undefined}
			data-ui-width="full"
			data-ui-height="full"
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

			{!value && !controller.isPending ? (
				<Placeholder disabled={props["data-ui-disabled"]} />
			) : null}

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
