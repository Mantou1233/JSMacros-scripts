cmd = Chat.getCommandManager()
	.createCommandBuilder("eval")
	.greedyStringArg("cmd")
	.executes(
		$.jfn(ctx => {
			try {
				const r = eval(ctx.getArg("cmd"));

				Chat.log(r);
			} catch (e) {
				Chat.log(e);
			}
		})
	);

$.cmd.add(cmd);
