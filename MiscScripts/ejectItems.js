
const wait = true, closewait = false;

let inv, map, e;

inv = Player.openInventory(), map = inv.getMap();

const actionTypeThrow = Java.type("net.minecraft.class_1713").field_7795
const dropAll = (slot) => {
    try { 
        const syncId = inv.getRawContainer().method_17577().field_7763
        Client.getMinecraft().field_1761.method_2906(syncId, slot, 1, actionTypeThrow, Player.getPlayer().getRaw())
    } catch(e) {Chat.log(e)}
}

function waitForGui(){
    e = JsMacros.waitForEvent("OpenScreen");e.context.releaseLock();
    
    inv = Player.openInventory(), map = inv.getMap();
}

const ejects = [
    "minecraft:diamond_block",
    "minecraft:emerald_block",
    "minecraft:gold_nugget"
]

const dump = {
    3: ["minecraft:ancient_debris"],
    4: ["minecraft:obsidian"]
}

function eject(slot, mat, mm = false) {
    let is = inv.getSlot(slot);
    if(is){
        if(("" + is.getDefaultName()) !== ("" + is.getName())) return;
        if(mat.includes(is.getItemId())){
       // Chat.log(`${slot}: ${is.getItemId()}`);
            if(!mm) dropAll(slot)
            else {
                inv.quick(slot);
                Client.waitTick(2);
            }
        }
    }
}
for (let slot of map.get("hotbar")) eject(slot, ejects)
for (let slot of map.get("main")) eject(slot, ejects)

inv.close();
