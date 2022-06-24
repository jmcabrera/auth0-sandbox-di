export function track(logChannel: string): PropertyDecorator {
    return (target: any, key) => {
        let original: any = target[key]
        Reflect.defineProperty(target, key, {
            get: () => {
                console.log("[", logChannel, "] Accessed property ", key, " whose value is ", original)
                return original
            },
            set: (newValue) => {
                console.log("[", logChannel, "] Changed property  ", key, ": ", original, "->", newValue)
                original = newValue
            },
            enumerable: true,
            configurable: true
        });
    };
}
