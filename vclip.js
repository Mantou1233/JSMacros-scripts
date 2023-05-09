const a = Chat.createCommandBuilder("vclip")
.intArg("a").executes(JavaWrapper.methodToJava(
    (ctx) => {
    Player.getPlayer().getRaw().method_5814(Player.getPlayer().getX(),Player.getPlayer().getY()+ctx.getArg("a"),Player.getPlayer().getZ())
    }
))

a.register()

event.stopListener = () => {
    a.unregister()
}
