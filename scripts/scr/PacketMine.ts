const mc = Client.getMinecraft();
let cmd;
let blck: BlockDataHelper = null;
cmd = Chat.getCommandManager()
	.createCommandBuilder("pmine")
	.greedyStringArg("cmd")
	.executes(
		$.jfn(ctx => {
			blck = Player.rayTraceBlock(20, false);
		})
	);

$.cmd.add(cmd);

// $.ev.on("Tick", () => {
// 	if (blck === null) return;

// 	blck.getBlock().getHardness();
// 	const wBlck = World.getBlock(blck.getX(), blck.getY(), blck.getZ());
// 	if (wBlck.getBlockStateHelper().isAir()) {
// 		blck = null;
// 		const nwHandler = mappings.remapClass(mc).invokeMethod("getNetworkHandler", []);
//         const RnwHandler = mappings
// 			.remapClass(nwHandler);
//             RnwHandler.invokeMethod("sendPacket")
// 			.sendPacket(
// 				new PlayerActionC2SPacket(
// 					PlayerActionC2SPacket.Action.ABORT_DESTROY_BLOCK,
// 					blockPos,
// 					direction
// 				)
// 			);
// 		mc.getNetworkHandler().sendPacket(
// 			new HandSwingC2SPacket(Hand.MAIN_HAND)
// 		);
// 		return;
// 	}
// });
