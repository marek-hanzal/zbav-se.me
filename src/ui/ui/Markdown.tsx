import type { ComponentProps, FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HeroImage } from "~/application-ui/ui/img.exports";
import type { uiButtonFn } from "~/ui/fn/uiButtonFn";
import { uiContainerFn } from "~/ui/fn/uiContainerFn";
import { uiLinkToFn } from "~/ui/fn/uiLinkToFn";
import { uiMarkdownFn } from "~/ui/fn/uiMarkdownFn";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { Typo } from "~/ui/ui/Typo";

export namespace Markdown {
	export interface Components {
		h1?: Typo.PropsEx;
		h2?: Typo.PropsEx;
		a?: uiButtonFn.Component<{}>;
		p?: Container.Props;
		strong?: Typo.PropsEx;
	}

	export interface Props
		extends uiMarkdownFn.Component<Omit<ComponentProps<typeof ReactMarkdown>, "components">> {
		components?: Components;
	}
}

export const Markdown: FC<Markdown.Props> = ({ className, components, ...props }) => {
	/**
	 * Wrapper div is used only to setup global CSS variables on top of inner components of markdown.
	 */
	return (
		<div
			{...uiMarkdownFn({
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
								{...uiLinkToFn({
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
								{...uiContainerFn({
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
								{...uiContainerFn({
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
