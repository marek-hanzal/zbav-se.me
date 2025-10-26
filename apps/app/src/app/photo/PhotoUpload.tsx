import { useMutation } from "@tanstack/react-query";
import {
	Container,
	Data,
	Progress,
	SpinnerIcon,
	Status,
} from "@use-pico/client";
import { genId } from "@use-pico/common";
import type { AllowedContentTypes, AllowedExtensions } from "@zbav-se.me/sdk";
import { PhotoIcon, Sheet } from "@zbav-se.me/ui";
import axios from "axios";
import {
	type ChangeEvent,
	type FC,
	type KeyboardEvent,
	type SyntheticEvent,
	useCallback,
	useRef,
	useState,
} from "react";
import { withS3PreSignMutation } from "~/app/s3/mutation/withS3PreSignMutation";
import { withUploadCreateMutation } from "~/app/upload/mutation/withUploadCreateMutation";
import { withUploadFetchQuery } from "~/app/upload/query/withUploadFetchQuery";

export namespace PhotoUpload {
	export type Value = string | undefined;
	export type OnChangeFn = (uploadId: Value) => void;

	export interface Props extends Omit<Sheet.Props, "slot" | "onChange"> {
		camera?: boolean;
		value: Value;
		onChange: OnChangeFn;
	}
}

export const PhotoUpload: FC<PhotoUpload.Props> = ({
	camera = false,
	value,
	onChange,
	...props
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [progress, setProgress] = useState(0);

	const preSignMutation = withS3PreSignMutation.useMutation();
	const createUploadMutation = withUploadCreateMutation.useMutation();

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

	const uploadMutation = useMutation({
		mutationKey: [
			"upload",
		],
		async mutationFn(file: File) {
			setProgress(0);

			setUpload(undefined, {
				where: {
					id: value,
				},
			});

			const id = genId();
			const path = `upload/${id}`;
			const contentType = file.type as AllowedContentTypes;

			const dot = file.name.lastIndexOf(".");
			const extension =
				dot !== -1 && dot < file.name.length - 1
					? file.name.slice(dot + 1).toLowerCase()
					: "unknown";

			const presign = await preSignMutation.mutateAsync({
				path,
				extension: extension as AllowedExtensions,
				contentType,
			});

			await axios.put(presign.url, file, {
				headers: {
					"Content-Type": contentType,
				},
				onUploadProgress(e) {
					setProgress(e.progress ?? 0);
				},
			});

			const upload = await createUploadMutation.mutateAsync({
				url: presign.cdn,
			});

			setUpload(upload, {
				where: {
					id: upload.id,
				},
			});
			onChange(upload.id);
		},
		onSettled() {
			setProgress(0);
		},
	});

	const uploadFetchQuery = withUploadFetchQuery.useQuery(
		{
			where: {
				id: value,
			},
		},
		{
			enabled: !!value && !uploadMutation.isPending,
		},
	);

	const stop = useCallback((event: SyntheticEvent) => {
		event.preventDefault();
		event.stopPropagation();
	}, []);

	const onUpload = useCallback(
		async (e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) {
				return;
			}

			uploadMutation.mutate(file);

			e.target.value = "";
		},
		[
			uploadMutation,
		],
	);

	return (
		<Container
			ref={containerRef}
			data-ui="PhotoSlot-root"
			position="relative"
			tweak={{
				slot: {
					root: {
						class: [
							"PhotoSlot-root",
						],
					},
				},
			}}
		>
			<input
				data-ui="PhotoSlot-input"
				ref={inputRef}
				type="file"
				accept="image/*"
				capture={camera ? "environment" : undefined}
				className="sr-only"
				onChange={onUpload}
			/>

			<Sheet
				onClick={pick}
				onKeyDown={onKeyDown}
				tweak={{
					slot: {
						root: {
							class: [
								"relative",
							],
						},
					},
				}}
				{...props}
			>
				<Data
					result={uploadFetchQuery}
					forceEmpty={uploadMutation.isPending}
					renderEmpty={() =>
						uploadMutation.isPending ? (
							<Status
								icon={SpinnerIcon}
								textTitle={"Uploading photo (title)"}
								tone={"primary"}
								theme={"light"}
								action={
									<Progress
										value={progress * 100}
										size={"lg"}
										tone={"secondary"}
										theme={"dark"}
									/>
								}
							/>
						) : (
							<Status
								icon={PhotoIcon}
								iconProps={{
									size: "2xl",
								}}
								textTitle={"Upload (title)"}
								titleProps={{
									size: "2xl",
								}}
								textMessage={
									props.disabled
										? "Upload - disabled (placeholder)"
										: "Listing - upload photo (placeholder)"
								}
								messageProps={{
									size: "xl",
								}}
								tone={"primary"}
							/>
						)
					}
					renderSuccess={({ data }) => (
						<img
							src={data.url}
							alt={data.id}
							className="absolute inset-0 h-full w-full object-cover object-center"
						/>
					)}
				/>
			</Sheet>

			{/* 
        If you bring back the "trash" action, also clear the cache to avoid flash:
        setUpload(undefined, { where: { id: value } });
      */}
		</Container>
	);
};
