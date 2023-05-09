import {
	getGradients,
	soup2JSON,
	presets,
	soup2Str,
	convertToHex,
	convertToRGB
} from "../services/color";
import { getSoupEffect } from "../services/formatter";
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
	.literalArg("getText")
	.greedyStringArg("text")
	.executes(
		jfn(ctx => {
			const soup = $f(ctx.getArg("text"));
			const charredSoup = soup.map(v => ({
				char: getSoupEffect(v) + v.text,
				color: v.color ? convertToRGB(v.color) : null
			}));
			Chat.log(
				Chat.createTextBuilder()
					.append(
						Chat.createTextHelperFromJSON(
							JSON.stringify(soup2JSON(charredSoup))
						)
					)
					.withClickEvent("copy_to_clipboard", soup2Str(charredSoup))
			);
		})
	)
	.or(1)
	.literalArg("getJson")
	.greedyStringArg("text")
	.executes(
		jfn(ctx => {
			Chat.log(
				Chat.createTextBuilder()
					.append(Chat.createTextHelperFromJSON(JSON.stringify(soup)))
					.withClickEvent("copy_to_clipboard", JSON.stringify(soup))
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
