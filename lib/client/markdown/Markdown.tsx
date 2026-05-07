import type { ComponentProps, FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HeroImage } from "~/common/ui/img";
import type { uiButton } from "../button/uiButton";
import { Container } from "../container/Container";
import { uiContainer } from "../container/uiContainer";
import { Group } from "../group";
import { uiLinkTo } from "../link-to";
import { Typo } from "../typo/Typo";
import { uiMarkdown } from "./uiMarkdown";

export namespace Markdown {
	export interface Components {
		h1?: Typo.PropsEx;
		h2?: Typo.PropsEx;
		a?: uiButton.Component<{}>;
		p?: Container.Props;
		strong?: Typo.PropsEx;
	}

	export interface Props
		extends uiMarkdown.Component<Omit<ComponentProps<typeof ReactMarkdown>, "components">> {
		components?: Components;
	}
}

export const Markdown: FC<Markdown.Props> = ({ className, components, ...props }) => {
	/**
	 * Wrapper div is used only to setup global CSS variables on top of inner components of markdown.
	 */
	return (
		<div
			{...uiMarkdown({
				className,
			})}
		>
			<ReactMarkdown
				skipHtml
				remarkPlugins={[
					remarkGfm,
				]}
				components={{
					h1({ children }) {
						return (
							<Typo
								label={children}
								data-ui-text="xl"
								data-ui-font="bold"
								{...components?.h1}
							/>
						);
					},
					h2({ children }) {
						return (
							<Typo
								label={children}
								data-ui-text="lg"
								data-ui-font="normal"
								{...components?.h2}
							/>
						);
					},
					a(props) {
						return (
							<a
								{...props}
								target="_blank"
								rel="noopener noreferrer"
								{...uiLinkTo({
									"data-ui-wrap": true,
									...components?.a,
								})}
								className={"overflow-hidden"}
							/>
						);
					},
					p({ children }) {
						return (
							<Container
								data-ui={"Markdown[p]"}
								{...components?.p}
							>
								{children}
							</Container>
						);
					},
					strong({ children }) {
						return (
							<Typo
								label={children}
								data-ui-font="bold"
								{...components?.strong}
							/>
						);
					},
					blockquote({ children }) {
						return (
							<blockquote
								{...uiContainer({
									className: [],
								})}
							>
								{children}
							</blockquote>
						);
					},
					em({ children }) {
						return (
							<Typo
								label={children}
								data-ui-italic
							/>
						);
					},
					ul({ children }) {
						return <ul>{children}</ul>;
					},
					hr() {
						return (
							<div
								{...uiContainer({
									"data-ui-background": "default",
									className: [
										"border-t",
										"h-px",
										"w-full",
										"my-4",
									],
								})}
							/>
						);
					},
					img(props) {
						return (
							<Group>
								<HeroImage
									wrapperProps={{
										"data-ui-height": "content",
									}}
									className={[
										"min-h-92",
									]}
									{...props}
								/>
							</Group>
						);
					},
				}}
				{...props}
			/>
		</div>
	);
};
