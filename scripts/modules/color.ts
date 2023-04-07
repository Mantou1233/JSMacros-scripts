import { getGradients, soup2JSON, presets, soup2Str } from "../services/color";
import { commands } from "../services/loader";

function validateHex(str: string) {
	const result = str
		.split("-")
		.map(v => v.toUpperCase())
		.filter(v => v.match(/([0-9]|[A-F]){2,6}/));
	if (result.length == 1) result.push(result[0]);
	return result;
}

const command = Chat.createCommandBuilder("color")
	.quotedStringArg("color")
	.suggest(
		jfn(function (ctx, suggest) {
			presets.forEach(pre => getPreview(suggest, pre));
			const vl = validateHex(suggest.getRemaining());
			if (vl.length !== 0) getPreview(suggest, vl);
			return Client;
		})
	)
	.greedyStringArg("text");
command.executes(
	jfn(ctx => {
		const colors = validateHex(ctx.getArg("color"));
		if (colors.length == 0) {
			Chat.log("no colors specified!");
		}
		const soup = getGradients(ctx.getArg("text") || "undefined", colors);
		Chat.log(
			Chat.createTextBuilder()
				.append(
					Chat.createTextHelperFromJSON(
						JSON.stringify(soup2JSON(soup))
					)
				)
				.withClickEvent("copy_to_clipboard", soup2Str(soup))
		);
	})
);
commands.add(command);

function getPreview(
	suggestor: Parameters<
		Parameters<
			ReturnType<typeof Chat.createCommandBuilder>["suggest"]
		>[0]["apply"]
	>[1],
	arr: string[]
) {
	suggestor.suggestWithTooltip(
		arr.join("-"),
		Chat.createTextHelperFromJSON(
			JSON.stringify(
				soup2JSON(getGradients("this is a example text", arr))
			)
		)
	);
}
