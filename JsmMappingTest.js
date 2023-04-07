const mappings = Reflection.loadMappingHelper(
  "https://maven.fabricmc.net/net/fabricmc/yarn/1.19.3%2Bbuild.5/yarn-1.19.3%2Bbuild.5-v2.jar"
);
function getExportfromClass(b4, uniq) {
  let txr = "";
  for (let key of Java.from(b4.fields.keySet().toArray())) {
    if (uniq.includes(b4.fields.get(key))) continue;
    uniq.push(b4.fields.get(key));
    txr += `"${b4.fields.get(key)}": "${key}",`;
  }
  for (let key of Java.from(b4.methods.keySet().toArray())) {
    if (uniq.includes(b4.methods.get(key).name)) continue;
    uniq.push(b4.methods.get(key).name);
    txr += `/** ${b4.methods.get(key)} */"${b4.methods.get(key).name}": "${
      key.split("(")[0]
    }",`;
  }
  return txr;
}
function getExport(clazzname, subclasses) {
  let txrs = "{",
    uniq = [];
  txrs += `__name__: "${
    mappings.getMappings().get(clazzname).name
  }", __sub__: "${[clazzname, ...(subclasses || [])].join(",")}",`;
  txrs += getExportfromClass(mappings.getMappings().get(clazzname), uniq);
  if (subclasses)
    for (let sy of subclasses)
      txrs += getExportfromClass(mappings.getMappings().get(sy), uniq);
  txrs += "} as const";
  return `export const ${mappings
    .getMappings()
    .get(clazzname)
    .name.split("/")
    .at(-1)} = ${txrs}`;
}

FS.open("./testMap.ts").write(
  `${getExport("net/minecraft/class_310")}\n\n${getExport(
    "net/minecraft/class_746",
    [
      "net/minecraft/class_1657",
      "net/minecraft/class_1309",
      "net/minecraft/class_1297",
    ]
  )}\n\n${getExport("net/minecraft/class_342")}`
);
