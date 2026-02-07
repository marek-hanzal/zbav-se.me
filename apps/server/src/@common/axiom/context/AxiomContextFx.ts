import { Context } from "effect";

export interface AxiomContext {
	token: string;
}

export class AxiomContextFx extends Context.Tag("AxiomContextFx")<AxiomContextFx, AxiomContext>() {
	//
}
