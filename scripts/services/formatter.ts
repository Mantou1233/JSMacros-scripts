import { SoupLike, convertToHex, getGradients } from "./color";

type ColorNodeType =
	| "GradientColorStop"
	| "GradientReset"
	| "CustomColor"
	| "Color"
	| "ColorEffect"
	| "Text";
type ColorNode = {
	type: ColorNodeType;
	value: string;
};

type ValueOf<T> = T[keyof T];
const colorMap = {
	"4": "dark_red",
	c: "red",
	"6": "gold",
	e: "yellow",
	"2": "dark_green",
	a: "green",
	b: "aqua",
	"3": "dark_aqua",
	"1": "dark_blue",
	"9": "blue",
	d: "light_purple",
	"5": "dark_purple",
	f: "white",
	"7": "gray",
	"8": "dark_gray",
	"0": "black"
} as const;

const specialColorMap = {
	k: "obfuscated",
	l: "bold",
	m: "strikethrough",
	n: "underline",
	o: "italic"
	//r: "reset"
} as const;

function $f(text: string) {
	const formatted = parseText(text);
	const nodes = parseNode(formatted);
	return generateText(nodes);
}

function parseText(text: string) {
	return text
		.replace("\\&", "&\\")
		.replaceAll(/&([4c6e2ab319d5f780klmnor])/g, (sub, $1) => `§^&${$1}§`)
		.replaceAll(
			/&#([a-fA-F0-9]{6,6})/g,
			(sub, $1) => `§^&#${String($1).toUpperCase()}§`
		)
		.replaceAll(
			/&g([a-fA-F0-9]{6,6})/g,
			(sub, $1) => `§^&g${String($1).toUpperCase()}§`
		)
		.replaceAll(/&gr/g, (sub, $1) => `§^&gr§`)
		.replaceAll("&\\", "&")
		.split("§")
		.filter(v => v !== "");
}

function parseNode(array: string[]): ColorNode[] {
	return array.map(text => {
		if (!text.startsWith("^&"))
		    return {
			type: "Text",
			value: text
		    };
		else if (text.startsWith("^&gr"))
		    return {
			type: "GradientReset",
			value: "true"
		    };
		else if (text.startsWith("^&g"))
		    return {
			type: "GradientColorStop",
			value: text.slice(3, 9)
		    };
		else if (text.startsWith("^&#"))
		    return {
			type: "CustomColor",
			value: text.slice(3, 9)
		    };
		else if (text.startsWith("^&"))
		    return {
			type: "Color",
			value: text.slice(2, 3)
		    };
    	})
}
function generateText(nodes: ColorNode[]): SoupLike[] {
	let currentGradient = [],
		deferredGradient: boolean = false,
		currentColor: string | null = null,
		currentEffect: ValueOf<typeof specialColorMap>[] = [];
	const soup: SoupLike[] = [];
	for (let node of nodes) {
		switch (node.type) {
			case "GradientColorStop": {
				if (deferredGradient) break;
				currentGradient.push(node.value);
				break;
			}
			case "GradientReset": {
				currentGradient = [];
				deferredGradient = false;
				break;
			}
			case "CustomColor": {
				if (currentGradient.length) currentGradient = [];
				currentColor = `#${node.value}`;
				break;
			}
			case "Color": {
				if (node.value == "r") {
					currentColor = null;
					currentEffect = [];
					break;
				}
				if (Object.keys(specialColorMap).includes(node.value)) {
					currentEffect.push(specialColorMap[node.value]);
					break;
				}
				if (currentGradient.length) currentGradient = [];
				currentColor = `&${node.value}`;
				break;
			}
			case "Text": {
				if (currentGradient.length >= 1) {
					if (!deferredGradient) deferredGradient = true;
					for (let { char: text, color } of getGradients(
						node.value,
						currentGradient
					)) {
						soup.push({
							color: `#${convertToHex(color)}`,
							text,
							...getEffectSoup(currentEffect)
						});
					}
					break;
				} else if (currentColor) {
					if (currentColor.startsWith("#")) {
						soup.push({
							color: currentColor,
							text: node.value,
							...getEffectSoup(currentEffect)
						});
					} else if (currentColor.startsWith("&")) {
						const colorCode = currentColor.slice(1);
						if (Object.keys(colorMap).includes(colorCode))
							soup.push({
								color: colorMap[currentColor.slice(1)],
								text: node.value,
								...getEffectSoup(currentEffect)
							});
					}
					break;
				} else {
					soup.push({
						text: node.value,
						...getEffectSoup(currentEffect)
					});
				}
				break;
			}
		}
	}
	return soup;
}

function getEffectSoup(effect) {
	const soup = {};
	for (let eff of effect) soup[eff] = true;
	return soup;
}
function getSoupEffect(soup: SoupLike) {
	const effects = [];
	const specialKey = Object.keys(specialColorMap);
	for (let key of Object.keys(soup)) {
		if (specialKey.includes(key)) effects.push(key);
	}
	return effects;
}

export { getEffectSoup, getSoupEffect, $f };
