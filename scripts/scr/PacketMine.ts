const mc = Client.getMinecraft();
const pl = Player.getPlayer().getRaw();

const InteractionHand = Java.type("net.minecraft.class_1268");
// const BetterBlockPos = <any>Java.type("baritone.api.utils.BetterBlockPos");
const Direction = Java.type("net.minecraft.class_2350");

const UP = Direction.field_11036;

let interactManager = mc.field_1761; // .interactionManager

const currentBreakingPosF = Reflection.getDeclaredField(
	interactManager.getClass(),
	"field_3714" // .currentBreakingPos
);
currentBreakingPosF.setAccessible(true);

const currentBreakingProgressF = Reflection.getDeclaredField(
	interactManager.getClass(),
	"field_3715" // .currentBreakingProgress
);
currentBreakingProgressF.setAccessible(true);

const getCurrBreakProg = () => currentBreakingProgressF.get(interactManager);
const getCurrBreakBlock = () => currentBreakingPosF.get(interactManager);
// .syncSelectedSlot - unknown identifier but exists in mappings??
// interactManager.method_2911();

let blck = null;
cmd = Chat.getCommandManager()
	.createCommandBuilder("mine")
	.executes(
		$.jafn(async ctx => {
			const rayBlock = Player.rayTraceBlock(20, false);
			if (!rayBlock || rayBlock.getBlockStateHelper().isAir()) return;
			blck = rayBlock.getBlockPos().getRaw();

			// .attackBlock;
			interactManager.method_2910(blck, UP);
			// .updateBlockBreakingProgress;
			interactManager.method_2902(blck, UP);
			// .swingHand; .mainHand
			pl.method_23667(InteractionHand.field_5808, true);

			while (getCurrBreakProg() != 0) {
				Chat.log(
					currentBreakingPosF.get(interactManager) +
						" " +
						currentBreakingProgressF.get(interactManager)
				);
				await $.waitTick();
				// .updateBlockBreakingProgress
				interactManager.method_2902(blck, UP);
				// .swingHand; .mainHand
				pl.method_23667(InteractionHand.field_5808, true);
			}

			Chat.log("done!");
		})
	);

$.cmd.add(cmd);
