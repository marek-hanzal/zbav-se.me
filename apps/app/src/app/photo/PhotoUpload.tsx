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

	const uploadFetchQuery = withUploadFetchQuery.useQuery(
		{
			where: {
				id: value,
			},
		},
		{
			enabled: !!value,
		},
	);

	const preSignMutation = withS3PreSignMutation.useMutation();
	const createUploadMutation = withUploadCreateMutation.useMutation();

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

			onChange(upload.id);
		},
	});

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
					renderEmpty={() =>
						uploadMutation.isPending || progress > 0 ? (
							<Status
								icon={SpinnerIcon}
								textTitle={"Uploading photo (title)"}
								tone={"secondary"}
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
					renderSuccess={({ data }) => {
						return (
							<img
								src={data.url}
								alt={data.id}
								className="absolute inset-0 h-full w-full object-cover object-center"
							/>
						);
					}}
				/>
			</Sheet>

			{/* <Action
				ref={trashRef}
				iconEnabled={TrashIcon}
				onClick={(e) => {
					stop(e);
					onChange(undefined);
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						stop(e);
						onChange(undefined);
					}
				}}
				size={"md"}
				tone={"danger"}
				border={false}
				tweak={{
					slot: {
						root: {
							class: [
								"absolute",
								"top-8",
								"right-1/2",
								"translate-x-1/2",
								"transition-none",
								"z-10",
								"opacity-0",
								"scale-75",
							],
						},
					},
				}}
			/>

			<Icon
				ref={spinnerRef}
				icon={SpinnerIcon}
				size={"xl"}
				tone={"primary"}
				theme={"light"}
				tweak={{
					slot: {
						root: {
							class: [
								"absolute",
								"top-1/2",
								"left-1/2",
								"-translate-x-1/2",
								"-translate-y-1/2",
								"opacity-0",
							],
						},
					},
				}}
			/>

			<Sheet
				ref={sheetRef}
				onClick={pick}
				onKeyDown={onKeyDown}
				style={{
					backgroundImage: `url(${src})`,
					backgroundSize: "cover",
					backgroundPosition: "center",

					backgroundRepeat: "no-repeat",
				}}
				{...props}
			>
				{src ? null : (
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
				)}
			</Sheet> */}
		</Container>
	);
};
