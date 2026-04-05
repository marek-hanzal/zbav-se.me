import type { FC } from "react";
import { Markdown } from "@/lib/client/markdown";

export namespace Part {
	export interface TextProps {
		text: string;
		isAssistant: boolean;
	}

	export const Text: FC<TextProps> = ({ text, isAssistant }) => {
		if (text.length === 0) {
			return (
				<p className="text-sm italic opacity-70">
					{isAssistant ? "Thinking..." : "Message in progress"}
				</p>
			);
		}

		return isAssistant ? (
			<Markdown className="prose prose-sm max-w-none prose-slate">{text}</Markdown>
		) : (
			<p className="whitespace-pre-wrap text-sm leading-6">{text}</p>
		);
	};

	export interface ReasoningProps {
		text: string;
		state?: string;
	}

	export const Reasoning: FC<ReasoningProps> = ({ text }) => {
		return (
			<div className="rounded-lg bg-slate-100 p-2 text-xs text-slate-600 italic">{text}</div>
		);
	};

	export interface ToolProps {
		toolCallId: string;
		state?: string;
	}

	export const Tool: FC<ToolProps> = ({ toolCallId, state }) => {
		return (
			<div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs">
				<span className="font-medium">Tool call:</span> {toolCallId}
				{state && <span className="ml-2 text-slate-500">({state})</span>}
			</div>
		);
	};

	export interface FileProps {
		file?: {
			name?: string;
			url?: string;
		};
	}

	export const File: FC<FileProps> = ({ file }) => {
		return (
			<div className="rounded-lg border border-slate-200 p-2">
				{file?.name && <span className="text-sm font-medium">{file.name}</span>}
			</div>
		);
	};

	export interface SourceDocumentProps {
		name?: string;
		content?: string;
	}

	export const SourceDocument: FC<SourceDocumentProps> = ({ name, content }) => {
		return (
			<div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs">
				<span className="font-medium">Source: </span>
				{name}
				{content && <span className="ml-2 italic">{content}</span>}
			</div>
		);
	};

	export interface SourceUrlProps {
		url?: string;
		title?: string;
	}

	export const SourceUrl: FC<SourceUrlProps> = ({ url, title }) => {
		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="block rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs hover:bg-slate-100"
			>
				<span className="font-medium">Source: </span>
				{title || url}
			</a>
		);
	};

	export interface StepStartProps {
		stepType?: string;
	}

	export const StepStart: FC<StepStartProps> = ({ stepType }) => {
		return (
			<div className="text-xs text-slate-400">
				{stepType ? `Starting: ${stepType}` : "Step started"}
			</div>
		);
	};

	export interface DynamicToolProps {
		toolName?: string;
		result?: string;
	}

	export const DynamicTool: FC<DynamicToolProps> = ({ toolName, result }) => {
		return (
			<div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs">
				<span className="font-medium">Tool: </span>
				{toolName}
				{result && <pre className="mt-1 overflow-x-auto text-slate-600">{result}</pre>}
			</div>
		);
	};
}
