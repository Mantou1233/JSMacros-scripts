export class EventManager {
	private tmpListeners: {
		[E in keyof Events]?: {
			listener: IEventListener;
			callbacks: {
				condition: EventCallback<E, boolean>;
				callback: EventCallback<E, void>;
				res: any;
				cancel: boolean;
			}[];
		};
	} = {};
	private listeners: IEventListener[] = [];

	/**
	 */
	on<E extends keyof Events>(event: E, callback: EventCallback<E, void>) {
		let cb: any = callback;
		if (typeof callback === "function") cb = $.jfn(callback);
		const listener = JsMacros.on(event, cb);
		this.listeners.push(listener);
		return listener;
	}

	waitForEvent<E extends keyof Events>(
		event: E,
		condition: EventCallback<E, boolean>,
		callback: EventCallback<E> | null = null,
		timeout: number = 600
	) {
		const cb = {
			condition,
			callback,
			res: undefined,
			cancel: false
		};
		// @ts-ignore because res.cancel is defined next line bozo
		const res: UtilWfePromise<E> = new Promise(res => (cb.res = res));
		res.cancel = () => {
			cb.res(null);
			cb.cancel = true;
		};
		if (timeout > 0) $.waitTick(timeout, res.cancel);
		this.tmpListeners[event] ??= {
			listener: JsMacros.on(
				event,
				$.jfn((e, c) => {
					if (!this.tmpListeners[event]) return;
					this.tmpListeners[event].callbacks.reduceRight(
						(_, cb, i, a) => {
							if (cb.cancel) return a.splice(i, 1);
							if (!cb.condition || cb.condition(e, c)) {
								cb.res({ event: e, context: c });
								cb.callback?.(e, c);
								a.splice(i, 1);
							}
							return _;
						},
						0
					);
					if (this.tmpListeners[event].callbacks.length) return;
					JsMacros.off(this.tmpListeners[event].listener);
					delete this.tmpListeners[event];
				})
			),
			callbacks: []
		};
		this.tmpListeners[event].callbacks.push(cb);
		return res;
	}

	unload() {
		this.listeners.map(li => JsMacros.off(li));

		Object.values(this.tmpListeners).forEach(li =>
			JsMacros.off(li.listener)
		);
	}
}

interface UtilWfePromise<E extends keyof Events>
	extends Promise<{
		readonly event: Events[E];
		readonly context: Packages.xyz.wagyourtail.jsmacros.core.language.EventContainer<any>;
	}> {
	cancel(): void;
}
