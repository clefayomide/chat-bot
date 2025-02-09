import { ActivityHandler, MessageFactory, TurnContext } from "botbuilder";

export class EchoBot extends ActivityHandler {
	constructor() {
		super();
		this.onMessage(async (context, next) => {
			const textEntry = context.activity.text;
			// simulate a mention since emulator does not support mention
			// context.activity.entities = [
			// 	{
			// 		type: "Mention",
			// 		mentioned: {
			// 			id: "fd18ea30-e6f1-11ef-9b79-f98d4fb5167b",
			// 			name: "Bot",
			// 		},
			// 		text: textEntry,
			// 	},
			// ];
			const entities = context.activity?.entities ?? [];

			if (entities.length) {
				const isBotMention = entities.some(
					(entity) => entity.mentioned && entity.mentioned.name === "Bot"
				);

				if (isBotMention) {
					await handleBotMention(context, textEntry);
				}
			}

			// By calling next() you ensure that the next BotHandler is run.
			await next();
		});
	}
}

async function handleBotMention(context: TurnContext, textEntry: string) {
	const entriesArray = textEntry.split(" ");
	if (entriesArray.length === 2) {
		const replyText = `Echo: ${entriesArray[1]}`;
		await context.sendActivity(MessageFactory.text(replyText, replyText));
	} else {
		await context.sendActivity(
			MessageFactory.text("Invalid format: Please enter a valid format")
		);
	}
}
