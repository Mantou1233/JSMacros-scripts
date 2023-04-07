function JSONSaver(filepath) {
    const f = FS.open(filepath);
    return {
      write: (j) => {
        f.write(JSON.stringify(j));
      },

      read: (j) => {
        return trytoParseJson(f.read()) || {};
      },
    };
}

function trytoParseJson(json){
    let parsed;
    try{
        parsed = json
    }catch(e){
        return undefined;
    }
    if(typeof parsed == "string") return undefined;
    return parsed;
}
globalThis.JSONSaver = JSONSaver;
