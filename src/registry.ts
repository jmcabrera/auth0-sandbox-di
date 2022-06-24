import "reflect-metadata"

const registry: { [key: string]: any } = {}
const mark = Symbol("inject-me-please")
export function register<T>(name: string, value: T) {
  registry[name] = value
}

export function resolve(name: string) {
  return registry[name]
}

export function inject<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(..._args: any[]) {
      super()
      let spec: Bag = Reflect.getMetadata(mark, constructor.prototype)
      if (spec) {
        let self = this as any;
        for (let k in spec) {
          self[k] = resolve(spec[k])
        }
      }
    }
  };
}

type Bag = { [key: string]: string }

/**
 * Property Decorator
 * @param injection the object to inject
 * @returns the property decorator to wrap the decorated property
 */
export function named(injection: string): PropertyDecorator {
  return (target: any, key) => {
    let spec = Reflect.getMetadata(mark, target)
    if (!spec) {
      spec = {} as Bag
      Reflect.defineMetadata(mark, spec, target)
    }
    spec[key] = injection
  }
}

