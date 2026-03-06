export namespace StaticResourceDocument {
	export interface Base {
		description: string;
		kind: "entity" | "enum" | "field" | "guide";
		name: string;
		title: string;
	}

	export interface Guide extends Base {
		kind: "guide";
		text: string;
	}

	export interface Entity extends Base {
		kind: "entity";
		relatedEntities?: string[];
		text: string;
	}

	export interface Enum extends Base {
		kind: "enum";
		purpose: string;
		values: Record<string, string>;
	}

	export interface Field extends Base {
		kind: "field";
		text: string;
	}

	export type Any = Entity | Enum | Field | Guide;
}
