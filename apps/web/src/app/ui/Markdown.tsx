import { Typo } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import type { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ThemeCls } from "~/app/ui/ThemeCls";

export namespace Markdown {
	export interface Props {
		children: string | null | undefined;
	}
}

export const Markdown: FC<Markdown.Props> = ({ children }) => {
	const { slots } = useCls(ThemeCls);

	return (
		<ReactMarkdown
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
							tone={"primary"}
							tweak={{
								slot: {
									root: {
										class: [
											"my-2",
										],
									},
								},
							}}
						/>
					);
				},
				h2({ children }) {
					return (
						<Typo
							label={children}
							size={"lg"}
							font={"semi"}
							tone={"primary"}
							tweak={{
								slot: {
									root: {
										class: [
											"my-1",
										],
									},
								},
							}}
						/>
					);
				},
				a(props) {
					return (
						<a
							className={slots.default({
								slot: {
									default: {
										token: [
											"tone.link.light.text",
										],
									},
								},
							})}
							{...props}
							target="_blank"
							rel="noopener noreferrer"
						/>
					);
				},
				p({ children }) {
					return (
						<div
							className={slots.default({
								slot: {
									default: {
										class: [
											"my-2",
										],
									},
								},
							})}
						>
							{children}
						</div>
					);
				},
				strong({ children }) {
					return (
						<Typo
							label={children}
							font={"bold"}
							tone={"primary"}
						/>
					);
				},
				blockquote({ children }) {
					return (
						<blockquote
							className={slots.default({
								slot: {
									default: {
										class: [
											"pl-2",
											"my-2",
											"text-sm",
											"italic",
										],
										token: [
											"border.default",
											"round.lg",
											"shadow.default",
											"square.md",
											"tone.primary.dark.text",
											"tone.primary.dark.border",
											"tone.primary.dark.bg",
											"tone.primary.dark.shadow",
										],
									},
								},
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
							italic
							tone={"primary"}
						/>
					);
				},
				ul({ children }) {
					return (
						<ul
							className={slots.default({
								slot: {
									default: {
										class: [
											"list-disc",
											"my-2",
											"pl-4",
										],
									},
								},
							})}
						>
							{children}
						</ul>
					);
				},
				hr() {
					return (
						<div
							className={slots.default({
								slot: {
									default: {
										class: [
											"w-full",
											"h-px",
											"my-4",
										],
										token: [
											"tone.primary.dark.bg",
										],
									},
								},
							})}
						/>
					);
				},
			}}
		>
			{children}
		</ReactMarkdown>
	);
};
