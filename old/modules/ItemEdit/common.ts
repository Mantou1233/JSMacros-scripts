const NBTElementHelper = Java.type(
	"xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper"
);
const ItemStackHelper = Java.type(
	"xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper"
);
const StringNbtReader = <any>Java.type("net.minecraft.class_2522");
const ItemStack = <any>Java.type("net.minecraft.class_1799");
const CreativeInventoryActionC2SPacket = Java.type("net.minecraft.class_2873");

function modifyMainHandStack(slot, item) {
	const saveSlot =
		slot < 0
			? Player.openInventory().getSelectedHotbarSlotIndex() + 36
			: slot;
	const ClientPlayNetworkHandler =
		Client.getMinecraft()[tr("getNetworkHandler")]();
	ClientPlayNetworkHandler[tr("sendPacket")](
		new CreativeInventoryActionC2SPacket(
			saveSlot,
			item.getRaw ? item.getRaw() : item
		)
	);
}

/**
 * add an item with hover event and click event, from melo
 * @param {any} sc screen;
 * @param {number} x
 * @param {number} y
 * @param {ItemStackHelper} item
 * @param {string} textIfEmpty
 */
function addItem(sc, x, y, item, textIfEmpty = "No Item!") {
	let it, st1, st2;
	if (!item || item.isEmpty()) {
		it = sc.addItem(x, y, "minecraft:barrier");
		const txt = Chat.createTextBuilder()
			.append("【星光照耀】")
			.withShowTextHover(
				typeof textIfEmpty === "string"
					? Chat.createTextHelperFromString(textIfEmpty)
					: textIfEmpty
			)
			.build();
		st1 = sc.addText(txt, x - 2, y - 2, 0x05000000, false);
		st2 = sc.addText(txt, x - 2, y + 6, 0x05000000, false);
	} else {
		it = sc.addItem(x, y, item);
		const txt = Chat.createTextBuilder()
			.append("空空")
			.withShowItemHover(item)
			.withCustomClickEvent(
				jfn(() => {
					Chat.log("ve");
				})
			)
			.build();
		st1 = sc.addText(txt, x - 2, y - 2, 0x05000000, false);
		st2 = sc.addText(txt, x - 2, y + 6, 0x05000000, false);
	}
	return [it, st1, st2];
}

function updateItem(newNBTStr, addPar: [any, number, number]) {
	let item;
	try {
		const parsed = StringNbtReader./*parse*/ method_10718(newNBTStr);
		item = new ItemStackHelper(ItemStack.method_7915(parsed));
		modifyMainHandStack(
			36 + Player.openInventory().getSelectedHotbarSlotIndex(),
			item
		);
	} catch (e) {
		Chat.log("invaild!!");
		Chat.log(e);
		return;
	}
	addItem(
		...addPar,
		item ||
			new ItemStackHelper(
				(<any>ItemStack).method_7915(
					StringNbtReader./*parse*/ method_10718(newNBTStr)
				)
			)
	);
	Chat.log("updated!");
}

/**
 *
 * @param {NBTElementHelper} nbt
 */
function nbtHelperToString(
	nbt: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper<any>
) {
	return (
		nbt
			?.toString()
			?.match(/^[^\{]*(\{.*\})$/)?.[1]
			.slice(1)
			.slice(0, -1) || "{}"
	);
}

function itemToNbtHelper(item) {
	return NBTElementHelper.resolve(
		item.method_7953(
			new (Java.type("net.minecraft.class_2487"))(/* NbtCompound*/)
		)
	);
}

const trMapping = {
	getNetworkHandler: "method_1562",
	sendPacket: "method_2883"
} as const;

function tr(ref: keyof typeof trMapping) {
	return trMapping[ref] || "none";
}

export {
	itemToNbtHelper,
	nbtHelperToString,
	addItem,
	updateItem,
	modifyMainHandStack
};
