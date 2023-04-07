import * as TestMap from "./testMap";

export function mappingInitator<K extends keyof typeof TestMap>(
  type: K,
  instance
) {
  const wrappedClass = mappings.remapClass(instance);
  return new Proxy(
    {},
    {
      get: (ignored, key: string, __) => {
        if (TestMap[key].startsWith("method"))
          return new Proxy(
            {},
            {
              apply: (n, thiz, args) => {
                wrappedClass.invokeMethod(key, args);
              },
            }
          );
        return wrappedClass.getFieldValue(key);
      },
    }
  ) as Spec<typeof TestMap[K]>;
}

type Spec<T> = {
  [K in keyof T]: K extends `method_${string}` ? Function : any;
};

// THIS ISNT DONE!!! 