import { SpinnerIcon } from "@use-pico/client/icon";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Progress } from "@use-pico/client/ui/progress";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import { withUploadMutation } from "@zbav-se.me/sdk/mutation/user";
import { withUploadFetchQuery } from "@zbav-se.me/sdk/query/user";
import { PhotoIcon } from "@zbav-se.me/ui/icon";
import { HeroImage } from "@zbav-se.me/ui/img";
import {
	type ChangeEvent,
	type FC,
	type KeyboardEvent,
	useCallback,
	useRef,
	useState,
} from "react";

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
	const inputRef = useRef<HTMLInputElement>(null);
	const [progress, setProgress] = useState(0);

	const setUpload = withUploadFetchQuery.useSet();

	const pick = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const onKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			inputRef.current?.click();
		}
	}, []);

	const uploadMutation = withUploadMutation.useMutation({
		async onPreMutation() {
			setProgress(0);

			setUpload(
				() => {
					return undefined;
				},
				{
					where: {
						id: value,
					},
				},
			);
		},
		async onPostMutation({ result }) {
			setUpload(() => result, {
				where: {
					id: result.id,
				},
			});
			onChange(result.id);
		},
	});

	const onUpload = useCallback(
		async (e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) {
				return;
			}

			uploadMutation.mutate({
				blob: file,
				name: file.name,
				onProgress: setProgress,
			});

			e.target.value = "";
		},
		[
			uploadMutation,
		],
	);

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
				disabled: (ui?.disabled || uploadMutation.isPending) ?? undefined,
				width: "full",
				height: "full",
				...ui,
			}}
			onClick={pick}
			onKeyDown={onKeyDown}
			{...props}
		>
			<input
				data-ui="PhotoUpload-[Input]"
				ref={inputRef}
				type="file"
				accept="image/*"
				capture={camera ? "environment" : undefined}
				className="sr-only"
				onChange={onUpload}
			/>

			{uploadMutation.isPending ? (
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
			) : null}

			{!value && !uploadMutation.isPending ? (
				<Container
					data-ui={"PhotoUpload-[Container.placeholder]"}
					ui={{
						flow: "vertical",
						height: "full",
						items: "center",
						justify: "center",
						round: "default",
					}}
				>
					<Status
						data-ui={"PhotoUpload-[Status.placeholder]"}
						icon={PhotoIcon}
						textTitle={translator.text("Photo upload placeholder (title)")}
						textMessage={translator.text("Photo upload placeholder (message)")}
						ui={{
							tone: ui?.disabled ? "neutral" : "primary",
							theme: "light",
							inner: "4xl",
						}}
						className={"text-center"}
					/>
				</Container>
			) : null}

			{value && !uploadMutation.isPending ? (
				<withUploadFetchQuery.Suspense
					data={{
						where: {
							id: value,
						},
					}}
					fallback={<SpinnerContainer />}
				>
					{({ data }) => {
						return (
							<HeroImage
								src={data.url}
								alt={data.id}
								visible
								ui={{
									round: "default",
								}}
							/>
						);
					}}
				</withUploadFetchQuery.Suspense>
			) : null}
		</Container>
	);
};
