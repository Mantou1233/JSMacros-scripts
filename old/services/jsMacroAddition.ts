import { events } from "./loader";

const hs = {};
const tb = [];
export function onKey(n: number, k: string, h) {
	hs[`${k}.${n}`] = hs[`${k}.${n}`] ? [...hs[`${k}.${n}`], h] : [h];
}
export function onTick(h) {
	tb.push(h);
}

events.add(
	JsMacros.on(
		"Key",
		jafn((ev: Events.Key) => {
			for (let h of hs[`${ev.key}.${ev.action}`] || []) {
				h(ev);
			}
		})
	)
);
events.add(
	JsMacros.on(
		"Tick",
		jafn(() => {
			for (let t of tb) {
				t();
			}
		})
	)
);
