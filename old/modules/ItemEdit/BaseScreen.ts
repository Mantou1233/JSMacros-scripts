export class BaseScreen {
	screen: ReturnType<typeof Hud.getOpenScreen> &
		ReturnType<typeof Hud.createScreen>;
	stack: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper;
	renderElements: Record<string, any> = {};
	stackRenderElements: any[] = [];
	renderXY: Record<string, [x: number, y: number]> = {};
	constructor(
		stack: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper = Player.getPlayer()
			.getMainHand()
			.copy()
	) {
		this.screen = Hud.createScreen(" ", false) as any;
		this.screen.setOnInit(jfn(this.init.bind(this)));

		this.stack = stack;
	}

	updateStack() {
		for (const element of this.stackRenderElements) {
			this.screen.removeElement(element);
		}
		this.renderStack(...this.renderXY["item"]);
	}

	renderStack(x: number, y: number) {
		this.renderXY["item"] = [x, y];
		const it = this.screen.addItem(x - 16, y, this.stack);
		const txt = Chat.createTextBuilder()
			.append("")
			.withShowItemHover(this.stack)
			.build();
		const st1 = this.screen.addText(txt, x - 2, y - 2, 0x05000000, false);
		const st2 = this.screen.addText(txt, x - 2, y + 6, 0x05000000, false);
		this.stackRenderElements.push(it, st1, st2);
	}

	init(screen: typeof this.screen) {
		const sx = screen.getWidth(),
			sy = screen.getHeight(),
			cx = int(sx / 2),
			cy = int(sy / 2);
		this.screen.addButton(
			cx - 90,
			sy - 35,
			60,
			20,
			"close",
			jfn(this.close.bind(this))
		);
		this.screen.addButton(
			cx - 30,
			sy - 25,
			60,
			20,
			"save",
			jfn(this.close.bind(this))
		);
		this.screen.addButton(
			cx - 30,
			sy - 45,
			60,
			20,
			"plazhoda",
			jfn(() => {})
		);
	}
	close() {
		this.screen.close();
	}
}
