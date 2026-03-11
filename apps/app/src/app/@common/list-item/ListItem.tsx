import { ChevronRightIcon, Icon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { type tUpload, zUpload } from "@zbav-se.me/sdk/api/user";
import type { FC, ReactNode } from "react";
import { Image } from "./Image";

export namespace ListItem {
	export type Hero = tUpload | ReactNode | undefined | null;

	export interface Props extends Omit<Group.Props, "title"> {
		hero: Hero;
		title: ReactNode;
		bottom: ReactNode;
	}

	export type PropsEx = Partial<Props>;
}

export const ListItem: FC<ListItem.Props> = ({
	hero,
	title,
	bottom,
	ui,
	className,
	children,
	...props
}) => {
	const upload = zUpload.safeParse(hero);
	const heroNode: ReactNode =
		hero == null ? (
			<Image />
		) : upload.success ? (
			<Image src={upload.data.url} />
		) : (
			(hero as ReactNode)
		);

	return (
		<Group
			data-ui={"ListItem[Group]"}
			className={[
				"min-h-24",
				"h-24",
				"md:h-28",
				"shrink-0",
				"relative",
				className,
			]}
			ui={{
				tone: "neutral",
				theme: "light",
				width: "full",
				background: "default",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					flow: "horizontal",
					position: "relative",
					height: "full",
					width: "full",
				}}
			>
				{heroNode}

				<Container
					className={"min-w-0 flex-1"}
					ui={{
						flow: "vertical",
						items: "start",
						justify: "space-between",
						height: "full",
						inner: "xs",
					}}
				>
					{title}

					{bottom}
				</Container>

				<Icon
					icon={ChevronRightIcon}
					ui={{
						tone: "neutral",
						theme: "light",
						snapTo: "right-center",
						text: "xl",
						color: "lead",
					}}
				/>

				{children}
			</Container>
		</Group>
	);
};
