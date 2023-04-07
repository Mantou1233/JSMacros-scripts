// my hud that i always lazied for edit to ts
// majority code from wag

const cu = require("./build/services/color");

if (!World.isWorldLoaded()) JsMacros.waitForEvent("ChunkLoad");

const StringNbtReader = Java.type("net.minecraft.class_2522");
const ItemStack = Java.type("net.minecraft.class_1799");
const ItemStackHelper = Java.type(
	"xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper"
);

const events = [];

const getTitleBx = (title = "Lolipop - pop = !!") => {
	const soup = cu.getGradients(title, [
		"F7E1A4",
		"CFF2FF" // BBDDF6
	]);
	return Chat.createTextHelperFromJSON(JSON.stringify(cu.soup2JSON(soup)));
};

const ITEM_SIZE = 16;
const PADDING_X = 25;
const PADDING_Y = 5;

/**
 * int, yes.
 */
const int = Math.floor.bind(Math);

/**
 * check item count
 * @param {string} it id or include string
 * @param {boolean} inc false or none to be exact match, else check include
 */
const getItemCount = (it, inc = false) => {
	const count = 0;
	if (
		!Player.openInventory().getMap().main ||
		!Player.openInventory().getMap().hotbar
	)
		return count;
	for (let i of Java.from(Player.openInventory().getMap().main).concat(
		Player.openInventory().getMap().hotbar
	)) {
		const item = inv.getSlot(i);
		const count = item.getCount();
		const id = item.getItemID();
		if ((!inc && id == it) || (inc && id.includes(it))) count += count;
	}
};

/**
 * create a item with id
 * @param {string} id item id with `minecraft:` omitted
 * @returns {ItemStackHelper}
 */
const empty = (id = "air") =>
	new ItemStackHelper(
		ItemStack./*fromNbt*/ method_7915(
			StringNbtReader./*parse*/ method_10718(`{
    id: "minecraft:${id}",
    Count: 1
  }`)
		)
	);

/**
 * returns a empty() if item given is air
 */
const route = (item, ix = undefined) =>
	item.getItemId() == "minecraft:air" ? empty(ix) : item;

/**
 * either gives back the stringified count or / if count is less than 1
 */
const txr = count => (count > 1 ? count + "" : "/");

/**
 * get the player ping by iterating tab and get ur name
 */
const getping = (
	w = World.getPlayers(),
	n = Player.getPlayer().getName().getString()
) => w.filter(v => v.getName() == n)[0]?.getPing() || -1;

/**
 * get ur damn pos stringified to 2nd digit
 */
const getpos = (p = Player.getPlayer()) =>
	[p.getX(), p.getY(), p.getZ()].map(v => v.toFixed(2));

const d2d = Hud.createDraw2D();

let tpsmeter, pingmeter, fpsmeter, posmeter, titlex;
let item, helper;

d2d.setOnInit(
	JavaWrapper.methodToJava(() => {
		const h = d2d.getHeight();
		const w = d2d.getWidth();
		const pl = Player.getPlayer();
		// title
		titlex = d2d.addText("Lolipop", int(w / 6), 2, 0xcff2ff, true);

		// semi-black bg
		d2d.addRect(
			int((w / 4) * 3) - PADDING_X - ITEM_SIZE,
			h - ITEM_SIZE - PADDING_Y,
			int((w / 4) * 3) - PADDING_X,
			h - PADDING_Y,
			0x000000,
			50
		);

		// mainhand item indicator
		item = d2d.addItem(
			int((w / 4) * 3) - PADDING_X - ITEM_SIZE,
			h - ITEM_SIZE - PADDING_Y,
			route(pl.getMainHand().copy()),
			true
		);
		item.setOverlayText(txr(item.getItem().getCount()));

		events.push(
			JsMacros.on(
				"HeldItemChange",
				JavaWrapper.methodToJava(ev => {
					if (!ev.offHand) {
						let it = route(ev.item.copy());
						item.setItem(it);
						item.setOverlayText(txr(it.getCount()));
					}
				})
			)
		);

		posmeter = d2d.addText(
			`${getpos().join(", ")}`,
			0,
			h - 10,
			0xffffff,
			true
		);
		tpsmeter = d2d.addText(World.getServerTPS(), 0, h - 20, 0xffffff, true);
		fpsmeter = d2d.addText(Client.getFPS(), 0, h - 30, 0xffffff, true);
		pingmeter = d2d.addText(`${getping()}ms`, 0, h - 40, 0xffffff, true);
	})
);
events.push(
	JsMacros.on(
		"Tick",
		JavaWrapper.methodToJava(() => {
			fpsmeter?.setText(Client.getFPS());
			tpsmeter?.setText(World.getServerTPS());
			posmeter?.setText(`${getpos().join(", ")}`);
			pingmeter?.setText(`${getping()}ms`);
			titlex?.setText(getTitleBx());

			let dim = World.getDimension();
			posmeter.color = 0xcff2ff;
			if (dim.includes("the_nether")) posmeter.color = 0xff0000;
			else if (dim.includes("end")) posmeter.color = 0xa020f0;
		})
	)
);
Hud.registerDraw2D(d2d);
// this fires when the service is stopped
event.stopListener = JavaWrapper.methodToJava(() => {
	Hud.unregisterDraw2D(d2d);
	for (let ev of events) JsMacros.off(ev);
});
