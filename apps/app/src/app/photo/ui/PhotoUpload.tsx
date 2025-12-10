import { SpinnerIcon } from "@use-pico/client/icon";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Progress } from "@use-pico/client/ui/progress";
import { Status } from "@use-pico/client/ui/status";
import { withUploadMutation } from "@zbav-se.me/sdk/mutation/user";
import { withUploadFetchQuery } from "@zbav-se.me/sdk/query/user";
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
	const [current, setCurrent] = useState<string | undefined>(value);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
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
						id: current,
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
			setCurrent(result.id);
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
			ref={containerRef}
			data-ui={"PhotoUpload"}
			ui={{
				position: "relative",
				disabled: (ui?.disabled || uploadMutation.isPending) ?? undefined,
				...ui,
			}}
		>
			<input
				data-ui="PhotoUpload-Input"
				ref={inputRef}
				type="file"
				accept="image/*"
				capture={camera ? "environment" : undefined}
				className="sr-only"
				onChange={onUpload}
			/>

			<Container
				data-ui={"PhotoUpload-Sheet"}
				onClick={pick}
				onKeyDown={onKeyDown}
				ui={{
					position: "relative",
				}}
				{...props}
			>
				{uploadMutation.isPending ? (
					<Status
						icon={SpinnerIcon}
						textTitle={"Uploading photo (title)"}
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
				) : null}

				{current && !uploadMutation.isPending ? (
					<withUploadFetchQuery.Suspense
						data={{
							where: {
								id: current,
							},
						}}
						fallback={<SpinnerContainer />}
					>
						{({ data }) => {
							return (
								<img
									src={data.url}
									alt={data.id}
									className="absolute inset-0 h-full w-full object-cover object-center"
								/>
							);
						}}
					</withUploadFetchQuery.Suspense>
				) : null}
			</Container>
		</Container>
	);
};
