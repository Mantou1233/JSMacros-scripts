import { EventManager } from "./EventManager";
import { LocalStorage } from "./LocalStorage";

let tickClock = 1;
const tickQueue: Record<string, Callback | Callback[]> = {};

const GLFW = <any>Java.type("org.lwjgl.glfw.GLFW");

const utils = {
	jfn: (<any>(fn => {
		return JavaWrapper.methodToJava(function (...args) {
			try {
				fn(...args);
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
	})) as typeof JavaWrapper.methodToJava,

	jafn: (<any>((fn_i, fn) => {
		if (!(typeof fn_i == "number")) {
			fn = fn_i;
		}
		return JavaWrapper.methodToJavaAsync(
			...((typeof fn_i == "number" ? [fn_i] : []) as []),
			function (...args) {
				try {
					fn(...args);
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
			}
		);
	})) as typeof JavaWrapper.methodToJavaAsync,

	/**
	 * local storage that stores into marcos/db.json
	 */
	store: null as any as LocalStorage,

	ev: null as any as EventManager,

	pos: ps => {
		if (ps.getX && ps.getY && ps.getZ)
			return [ps.getX(), ps.getY(), ps.getZ()];

		if (ps.x && ps.y && ps.z) return [ps.x, ps.y, ps.z];
	},

	cmd: {
		cache: [] as CommandBuilder[],

		add(cmd: CommandBuilder) {
			cmd.register();

			$.cmd.cache.push(cmd);
		},

		unload() {
			$.cmd.cache.forEach(cmd => cmd.unregister());
		}
	},

	GLFW: {
		get handle() {
			return Client.getMinecraft()
				.method_22683() // getWindow()
				.method_4490(); // getHandle()
		},

		setWindowTitle(title) {
			GLFW.glfwSetWindowTitle(this.handle, title);
		},

		/**
		 * Requests user attention, change your icon orange basically
		 */
		requestAttention() {
			// prettier-ignore
			if (!Client
				.getMinecraft()
				.method_1569())// .isWindowFocused()
				
				GLFW.glfwRequestWindowAttention(this.handle);
		}
	},

	js: {
		/**
		 * get in a string,
		 * if it is undefined, or any number or array,
		 * gives back a empty obj.
		 */
		safeParseJSON(str: string) {
			let val: any = {};
			try {
				val = JSON.parse(str);
			} catch (e) {}
			return $.js.isRecord(val) ? val : {};
		},

		/**
		 * check is the object `{}` rather than being a
		 * array, a host or anything
		 */
		isRecord(obj: unknown) {
			return Object.prototype.toString.call(obj) === "[object Object]";
		}
	},

	async waitTick(ticks: number = 1, callback?: () => void) {
		if (typeof ticks !== "number")
			throw new Error("ticks must be a number");
		if (ticks <= 0) return callback?.();
		if (ticks === Infinity) throw "滾";
		ticks = Math.ceil(ticks) + tickClock;
		return new Promise(res => {
			if (tickQueue[ticks]) {
				const li = tickQueue[ticks];
				if (Array.isArray(li)) li.push(res);
				else tickQueue[ticks] = [li, res];
			} else tickQueue[ticks] = res;
		}).then(() => callback?.());
	},

	/**
	 * inits ev. for ticks waiting, etc
	 * also initatable w/ `$()` but idk why and it WILL change.
	 */
	init() {
		$.ev = new EventManager();
		$.store = new LocalStorage();
		$.ev.on("Tick", () => {
			tickClock++;

			if (!(tickClock & 7))
				// recheck every 7 ticks
				Object.keys(tickQueue).forEach(k => {
					let li = tickQueue[k];
					if (+k > tickClock) return;
					if (Array.isArray(li)) {
						li.forEach(r => r());
					} else li();
					delete tickQueue[k];
				});
			else if (tickQueue[tickClock]) {
				// check usually
				let li = tickQueue[tickClock];
				if (Array.isArray(li)) {
					li.forEach(r => r());
				} else li();
				delete tickQueue[tickClock];
			}
		});
	},

	/**
	 * well, this exits the thing and reloads it.
	 */
	youJustLostTheGame() {
		throw "not impl'd cuz im lazy";
	},

	/**
	 * unload stuffs
	 */
	unload() {
		$.ev.unload();
		$.cmd.unload();
	},

	/**
	 * @private
	 * @deprecated
	 * @readonly
	 *
	 * just the visual test ignore this
	 */
	_() {
		throw "啦啦啦 我是快樂的光光 耶耶耶";
	}
};

const $ = (globalThis.$ = Object.assign(
	utils.init.bind(utils),
	utils
)) as typeof utils & {
	(): any;
};

export { utils, $ };
