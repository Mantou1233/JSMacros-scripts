if (!World.isWorldLoaded()) JsMacros.waitForEvent("ChunkLoad");
import type { SoupLike } from "./services/color";
import { commands, events, unloaders } from "./services/loader";
import { $f } from "./services/formatter";
globalThis.rjafn = JavaWrapper.methodToJavaAsync;
globalThis.rjfn = JavaWrapper.methodToJava;
globalThis.jafn = function (fn) {
	return JavaWrapper.methodToJavaAsync((...param) => {
		try {
			fn(...param);
		} catch (e) {
			Chat.log(e);
		}
	});
} as any;
globalThis.jfn = function (fn) {
	return JavaWrapper.methodToJava((...param) => {
		try {
			fn(...param);
		} catch (e) {
			e.getStackTrace
				? FS.open("../log.txt").append(
						"\n\nError:\n" + e.getStackTrace()
				  )
				: e;
			Chat.log(
				//Object.getOwnPropertyNames(
				e.getStackTrace ? e.getStackTrace() : e
			);
		}
	});
} as any;
globalThis.jf = Java.from;
globalThis.int = Math.floor;
globalThis.$f = $f;
const jt = Java.type;

const mappings = Reflection.loadMappingHelper(
	"https://maven.fabricmc.net/net/fabricmc/yarn/1.19.3%2Bbuild.5/yarn-1.19.3%2Bbuild.5-v2.jar"
);
globalThis.mappings = mappings;

Java.type = <any>function type(ref: string) {
	return jt(ref.replaceAll("/", "."));
};

declare global {
	var jafn: typeof JavaWrapper.methodToJavaAsync;
	var jfn: typeof JavaWrapper.methodToJava;

	var rjafn: typeof JavaWrapper.methodToJavaAsync;
	var rjfn: typeof JavaWrapper.methodToJava;
	var jf: typeof Java.from;

	var mappings: ReturnType<typeof Reflection.loadMappingHelper>;

	var int: typeof Math.floor;

	var $f: (str: string) => SoupLike[];
}

const BASE_DIR =
	"C:/Users/pc/AppData/Roaming/.minecraft/farbic/config/jsMacros/Macros/build/";

for (let file of FS.list(BASE_DIR + "services")) {
	if (FS.isDir(BASE_DIR + "service/" + file)) continue;
	require(BASE_DIR + "services/" + file);
}

for (let file of FS.list(BASE_DIR + "modules")) {
	if (FS.isDir(BASE_DIR + "modules/" + file) || file.startsWith("_"))
		continue;
	require(BASE_DIR + "modules/" + file);
}

commands.map(v => v.register());
(event as any).stopListener = JavaWrapper.methodToJava(() => {
	commands.map(v => v.unregister());
	events.map(v => JsMacros.off(v));
	unloaders.map(v => v());
});
