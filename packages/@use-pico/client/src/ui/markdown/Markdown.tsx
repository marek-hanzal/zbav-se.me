import { Typo } from "@use-pico/client/ui/typo";
import { type Cls, useCls, VariantProvider } from "@use-pico/cls";
import type { ComponentProps, FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PicoCls } from "../../cls";
import { MarkdownCls } from "./MarkdownCls";

export namespace Markdown {
	export interface Props extends MarkdownCls.Props<ComponentProps<typeof ReactMarkdown>> {
		tone?: Cls.VariantOf<PicoCls, "tone">;
		theme?: Cls.VariantOf<PicoCls, "theme">;
	}
}

export const Markdown: FC<Markdown.Props> = ({
	tone,
	theme,
	cls = MarkdownCls,
	tweak,
	...props
}) => {
	const { slots } = useCls(cls, tweak);

	return (
		<VariantProvider
			cls={PicoCls}
			variant={{
				tone,
				theme,
			}}
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
								size={"xl"}
								font={"bold"}
							/>
						);
					},
					h2({ children }) {
						return (
							<Typo
								label={children}
								size={"lg"}
								font={"normal"}
							/>
						);
					},
					a(props) {
						return (
							<a
								className={slots.a()}
								{...props}
								target="_blank"
								rel="noopener noreferrer"
							/>
						);
					},
					p({ children }) {
						return <div className={slots.p()}>{children}</div>;
					},
					strong({ children }) {
						return (
							<Typo
								label={children}
								font={"bold"}
							/>
						);
					},
					blockquote({ children }) {
						return <blockquote className={slots.blockquote()}>{children}</blockquote>;
					},
					em({ children }) {
						return (
							<Typo
								label={children}
								italic
							/>
						);
					},
					ul({ children }) {
						return <ul className={slots.ul()}>{children}</ul>;
					},
					hr() {
						return <div className={slots.hr()} />;
					},
				}}
				{...props}
			/>
		</VariantProvider>
	);
};
