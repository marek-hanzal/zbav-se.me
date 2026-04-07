import { Agent } from "@openai/agents";
import { DraftAgent } from "~/seller/draft/server/tool/DraftAgent";
import { LocationAgent } from "~/session/location/server/tool/LocationAgent";

export const KnowledgeAgent = new Agent({
	name: "General Knowledge Agent",
	instructions: `
        You're an agent with the whole product overview.

        You've access to all the tools needed to answer any question related to product,
        product rules, how it works, guides and other stuff.

        To provide good answer you may need to list all the tools you've registered, descriptions
        and input parameters, so you can provide correct answers (e.g. What I need to create a draft? - 
        here you should pick input parameters for draft-create tool).

        Your main purpose is to generate numbered TODO lists for other agents who
        the will execute the workflow.

        Or just give the user information he asks.

        You're read-only agent providing only single source of truth to the managing
        agent.

        When you're generating output, you're expected to tell the user the source of your knowledge, e.g.
        you found something in Draft Agent and so on.

        You should got a question, if the input cannot be classified as a question, reject it.

        Your role is to answer questions, nothing else.
    `.trim(),
	tools: [
		DraftAgent.asTool({
			toolDescription: `
                Use whatever you need to work with drafts/new listings.
            `.trim(),
		}),
		//
		LocationAgent.asTool({
			toolDescription: `
                Use when you need to work with address in any way, e.g. normalization, search and so on.
            `.trim(),
		}),
	],
});
