import { commands } from "../services/loader";

const command = Chat.createCommandBuilder("eval").greedyStringArg("val");
command.executes(
	JavaWrapper.methodToJavaAsync(ctx => {
		/*
            const r=[];
            Java.from(
                World.getPlayers()
            ).map(v => v
                .getDisplayText()
                .visit(
                    JavaWrapper.methodToJava((_, v) => r.push(
                        [_.getCustomColor(), v]
                    ))
                )
            );
            FS.open("./v.txt").write(JSON.stringify(r))
            */
		const k = Object.getOwnPropertyNames;
		const j = JSON.stringify;
		Chat.log(eval(ctx.getArg("val")));
	})
);

commands.add(command);
