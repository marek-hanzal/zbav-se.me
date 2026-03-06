export namespace StaticResourceDocument {
	export interface Invariant {
		label: string;
		value: string;
	}

	export interface Base {
		description: string;
		kind: "entity" | "enum" | "field" | "guide" | "profile";
		name: string;
		title: string;
	}

	export interface Guide extends Base {
		kind: "guide";
		text: string;
	}

	export interface Profile extends Base {
		kind: "profile";
		avoid?: string[];
		exampleInterpretation?: string[];
		exampleRequest?: Record<string, unknown>;
		minimumInputs?: string[];
		recommended?: string[];
		text: string;
		whenToUse?: string[];
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
		actorDependent?: boolean;
		appearsWhen?: string[];
		caveats?: string[];
		filterable?: boolean;
		invariants?: Invariant[];
		meaning?: string;
		nullableWhen?: string[];
		requires?: string[];
		responseOnly?: boolean;
		kind: "field";
		text: string;
		type?: string;
		unit?: string;
	}

	export type Any = Entity | Enum | Field | Guide | Profile;
}
