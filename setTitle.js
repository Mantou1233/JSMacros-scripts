if (!World.isWorldLoaded()) JsMacros.waitForEvent("ChunkLoad");

/**
 * int, yes.
 */
const int = Math.floor.bind(Math);

while(true){
 Java.type("org.lwjgl.glfw.GLFW").glfwSetWindowTitle(Client.getMinecraft().method_22683().method_4490(), "lolipop - pop = ?");
 Time.sleep(1);
}