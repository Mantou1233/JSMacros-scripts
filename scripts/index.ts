if (!World.isWorldLoaded()) JsMacros.waitForEvent("ChunkLoad");
import { utils } from "./lib/utils";

globalThis.int = Math.floor;
const OJava_type = Java.type;

const mappings = Reflection.loadMappingHelper(
	"https://maven.fabricmc.net/net/fabricmc/yarn/1.19.3%2Bbuild.5/yarn-1.19.3%2Bbuild.5-v2.jar"
);
globalThis.mappings = mappings;

Java.type = <any>function type(ref: string) {
	return OJava_type(ref.replaceAll("/", "."));
};

declare global {
	var $: typeof utils;
	var mappings: ReturnType<typeof Reflection.loadMappingHelper>;

	var int: typeof Math.floor;
	var cmd: CommandBuilder;
}

utils.init();
async function main() {
	require("./scr/index");

	Chat.log("wait me for 5 sec pls");
	let rnTime = Date.now();
	await $.waitTick(100);
	Chat.log((Date.now() - rnTime) / 1000 + "s");
	Chat.log("ok i done bath");
	Chat.log("*bye*");
}

main();

(event as any).stopListener = $.jfn(() => {
	$.unload();
});
