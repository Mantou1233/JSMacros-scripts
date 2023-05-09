import {
	addItem,
	itemToNbtHelper,
	nbtHelperToString,
	updateItem
} from "./common";
Java.type("net.minecraft.");

export function handleGui() {
	const mainhandStack = Player.getPlayer().getMainHand();
	let txr = "";
	let removes: any[] = [];
	let it: _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item,
		inputBar: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.TextFieldWidgetHelper,
		updateBtn: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.ClickableWidgetHelper<
			any,
			any
		>;
	Player.openInventory().getSelectedHotbarSlotIndex();
	const screen = Hud.createScreen(" ", false) as ReturnType<
		typeof Hud.getOpenScreen
	> &
		ReturnType<typeof Hud.createScreen>;
	screen.setOnInit(
		jfn((s: typeof screen) => {
			const sw = screen.getWidth(),
				sh = screen.getHeight(),
				cw = int(sw / 2),
				ch = int(sh / 2);

			removes.push(addItem(s, cw, ch - 20, mainhandStack));
			inputBar = s.addTextInput(
				cw - 320,
				ch + 16,
				640,
				16,
				"",
				jfn(newTxr => (txr = newTxr))
			);
			inputBar.setMaxLength(200000);
			inputBar.setText(
				nbtHelperToString(itemToNbtHelper(mainhandStack.getRaw()))
			);
			Chat.log(inputBar.getRaw());

			updateBtn = s.addButton(
				cw - 20,
				ch + 48,
				40,
				16,
				"Update NBT",
				jfn(() => {
					removes.forEach(v => s.removeElement(v));
					updateItem(txr, [s, cw, ch - 20]);
				})
			);
		})
	);

	Hud.openScreen(screen);
}
