const registry = new Map()

function createDecorator(tokenString) {
  return new class Decorator {
    provider = function (item) {
      registry.set(tokenString, item)
      for(k in item) {
        console.log(k)
        this[k] = item[k]
      }
    }
//    resolve() {
//      return registry.get(tokenString)
//    }
  }
}

const IDbService = createDecorator('dbService')

class A {
  constructor(
    db = IDbService
  ) {
    this.db = db
  }
  test() {
    return this.db()
  }
}

function db() {
  console.log('function')
}

IDbService.provider(db)


function main() {
  const a = new A()
  a.test()


  IDbService.provider(function () {
    console.log(2)
  })

  const b = new A()
  b.test()

}

main()