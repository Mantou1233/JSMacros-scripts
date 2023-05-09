// elements for obtaining vals
const presets = [
	["084CFB", "ADF3FD"],
	[getRandomHexColor(), getRandomHexColor()],
	["F7E1A4", "BBDDF6"],
	["FB4C4C", "FDF6C4"],
	["41E0F0", "FF8DCE"],
	["FF0000", "FF7F00", "FFFF00", "00FF00", "0000FF", "4B0082", "9400D3"]
];
/**
 * getting a random hex color
 */
function getRandomHexColor() {
	return Math.floor(Math.random() * 16777215)
		.toString(16)
		.toUpperCase();
}

function hex(c) {
	let s = "0123456789abcdef";
	let i = parseInt(c);
	if (i == 0 || isNaN(c)) return "00";
	i = Math.round(Math.min(Math.max(0, i), 255));
	return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
}

/**
 * Convert an RGB triplet to a hex string
 */
function convertToHex(rgb: RGBResolvable) {
	if (rgb == null) return null;
	return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

/**
 * Removes '#' in color hex string
 */
function trim(s) {
	return s.charAt(0) == "#" ? s.substring(1, 7) : s;
}

/**
 * Convert a hex string to an RGB triplet
 */
function convertToRGB(hex): RGBResolvable {
	let color = [];
	color[0] = parseInt(trim(hex).substring(0, 2), 16);
	color[1] = parseInt(trim(hex).substring(2, 4), 16);
	color[2] = parseInt(trim(hex).substring(4, 6), 16);
	return color as RGBResolvable;
}

/**
 * JS impl of HexUtils from RoseGarden.
 * https://github.com/Rosewood-Development/RoseGarden/blob/master/src/main/java/dev/rosewood/rosegarden/utils/HexUtils.java#L358
 * i forgor where the implementation source is, but anyways
 */
class Gradient {
	colors: any;
	gradients: any[];
	steps: number;
	step: number;
	constructor(colors, numSteps) {
		this.colors = colors;
		this.gradients = [];
		this.steps = numSteps - 1;
		this.step = 0;

		const increment = this.steps / (colors.length - 1);
		for (let i = 0; i < colors.length - 1; i++)
			this.gradients.push(
				new TwoStopGradient(
					colors[i],
					colors[i + 1],
					increment * i,
					increment * (i + 1)
				)
			);
	}

	/* Gets the next color in the gradient sequence as an array of 3 numbers: [r, g, b] */
	next(): RGBResolvable {
		if (this.steps <= 1) return this.colors[0];

		const adjustedStep = Math.round(
			Math.abs(
				((2 *
					Math.asin(
						Math.sin(this.step * (Math.PI / (2 * this.steps)))
					)) /
					Math.PI) *
					this.steps
			)
		);
		let color;
		if (this.gradients.length < 2) {
			color = this.gradients[0].colorAt(adjustedStep);
		} else {
			const segment = this.steps / this.gradients.length;
			const index = Math.min(
				Math.floor(adjustedStep / segment),
				this.gradients.length - 1
			);
			color = this.gradients[index].colorAt(adjustedStep);
		}

		this.step++;
		return color;
	}
}

class TwoStopGradient {
	startColor: any;
	endColor: any;
	lowerRange: any;
	upperRange: any;
	constructor(startColor, endColor, lowerRange, upperRange) {
		this.startColor = startColor;
		this.endColor = endColor;
		this.lowerRange = lowerRange;
		this.upperRange = upperRange;
	}

	colorAt(step) {
		return [
			this.calculateHexPiece(step, this.startColor[0], this.endColor[0]),
			this.calculateHexPiece(step, this.startColor[1], this.endColor[1]),
			this.calculateHexPiece(step, this.startColor[2], this.endColor[2])
		];
	}

	calculateHexPiece(step, channelStart, channelEnd) {
		const range = this.upperRange - this.lowerRange;
		const interval = (channelEnd - channelStart) / range;
		return Math.round(interval * (step - this.lowerRange) + channelStart);
	}
}

type RGBResolvable = [red: number, green: number, blue: number];
interface SoupLike {
	text: string;
	color?: string;
	obfuscated?: boolean;
	bold?: boolean;
	strikethrough?: boolean;
	underline?: boolean;
	italic?: boolean;
	reset?: boolean;
}

function getGradients(text: string, colors: string[]) {
	if (text.length == 2 && colors.length >= 2)
		return [
			{
				color: convertToRGB(colors[0]),
				char: text[0]
			},
			{
				color: convertToRGB(colors[colors.length - 1]),
				char: text[1]
			}
		];
	let gradientor = new Gradient(
		colors.map(convertToRGB),
		text.replace(/ /g, "").length
	);
	const soup: {
		char: string;
		color: RGBResolvable | null;
	}[] = [];
	for (let char of text) {
		if (char == " ") {
			soup.push({
				char,
				color: null
			});
			continue;
		}
		soup.push({
			char,
			color: gradientor.next()
		});
	}
	return soup;
}

function soup2JSON(array: ReturnType<typeof getGradients>) {
	let Gson = [];
	for (let ele of array) {
		Gson.push({
			color: ele.color ? `#${convertToHex(ele.color)}` : null,
			text: ele.char
		});
	}
	return Gson.map(element => {
		if (element.color == null) delete element.color;
		return element;
	});
}

function soup2Str(array: ReturnType<typeof getGradients>) {
	return array
		.map(({ color, char }) => {
			if (color == null) return " ";
			return `&#${convertToHex(color)}${char}`;
		})
		.join("");
}

export {
	getGradients,
	soup2JSON,
	soup2Str,
	RGBResolvable,
	SoupLike,
	getRandomHexColor,
	presets,
	convertToRGB,
	convertToHex
};
