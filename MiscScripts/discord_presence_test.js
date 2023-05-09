Reflection.loadJarFile(
	"C:/Users/pc/AppData/Roaming/.minecraft/farbic/config/jsMacros/Macros/deps/discord-ipc-2.jar"
);

const DiscordIPC = Reflection.getClass(
	"meteordevelopment.discordipc.DiscordIPC"
).static;
const RichPresence = Reflection.getClass(
	"meteordevelopment.discordipc.RichPresence"
);
const Long = java.lang.Long;

const start = DiscordIPC.start(
	new Long("932987954815696957"),
	JavaWrapper.methodToJava(() => {
		Chat.log(DiscordIPC.getUser().username);
	})
);

if (!start) {
	Chat.log("failed to start the ipc");
	stop();
}
Chat.log("started i think");
Client.waitTick(20);

const pr = new RichPresence();
pr.setDetails("cats are GOOD!???");
pr.setState("ya");
pr.setStart(java.time.Instant.now().getEpochSecond());
const a = DiscordIPC.setActivity(pr);
Chat.log("i think itz done");
Chat.log(a);
event.stopListener = function stop() {
	DiscordIPC.stop();
	Chat.log("closdz");
};
