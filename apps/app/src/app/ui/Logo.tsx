import { Tx } from "@use-pico/client";
import { tvc } from "@use-pico/cls";
import type { FC } from "react";

export const Logo: FC = () => {
	return (
		<div
			className={tvc([
				"flex",
				"flex-col",
				"items-center",
				"relative",
			])}
		>
			<div
				className={tvc([
					"relative",
					"font-limelight",
					"text-4xl",
				])}
			>
				<Tx
					label={"zbav-se.me"}
					tone={"primary"}
					display={"block"}
					tweak={{
						slot: {
							root: {
								class: [
									"z-5",
								],
							},
						},
					}}
				/>
				<Tx
					label={"zbav-se.me"}
					tone={"secondary"}
					display={"block"}
					tweak={{
						slot: {
							root: {
								class: [
									"absolute",
									"scale-105",
									"top-0",
									"left-0",
									"opacity-25",
								],
							},
						},
					}}
				/>
			</div>

			<Tx
				label="Logo motto (label)"
				tone="secondary"
				theme={"light"}
				font={"bold"}
				display={"block"}
				size={"xl"}
				tweak={{
					slot: {
						root: {
							class: [
								"relative",
								"top-[-10%]",
								"transform-[rotateZ(-3deg)]",
							],
						},
					},
				}}
			/>
		</div>
	);
};
