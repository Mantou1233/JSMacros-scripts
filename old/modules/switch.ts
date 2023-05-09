import { onKey } from "../services/jsMacroAddition";
import { commands } from "../services/loader";

let swi = "minecraft:diamond_chestplate",
	swi2 = "minecraft:elytra";
const command = Chat.createCommandBuilder("setswi")
	.booleanArg("boo")
	.itemArg("item");
command.executes(
	jafn(ctx => {
		if (ctx.getArg("boo")) swi = ctx.getArg("item").getItemId();
		else swi2 = ctx.getArg("item").getItemId();
	})
);

commands.add(command);
const command2 = Chat.createCommandBuilder("getswi");
command2.executes(
	jafn(ctx => {
		Chat.log(`sw: ${swi}, ${swi2}`);
	})
);

commands.add(command2);
onKey(1, "key.keyboard.apostrophe", (ev: Events.Key) => {
	if (ev.action != 1) return;
	if (ev.key == "key.keyboard.apostrophe") {
		const inv = Player.openInventory();
		const keys = jf(inv.getMap().keySet().toArray());
		if (
			!keys.includes("main") ||
			!keys.includes("hotbar") ||
			!keys.includes("chestplate")
		)
			return;
		const map = inv.getMap() as any;
		const chest = Player.getPlayer().getChestArmor().getItemId();
		let iX = [swi, swi2],
			x = -1;
		if (chest == iX[0]) {
			x = 1;
		} else if (chest == iX[1]) {
			x = 0;
		}
		if (x == -1) return;

		for (let i of jf(map.main).concat(jf(map.hotbar)) as number[]) {
			const item = inv.getSlot(i);
			if (item.getItemID() == iX[x]) {
				inv.swap(6, i);
			}
		}
	}
});
