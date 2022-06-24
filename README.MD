# Purpose

This is an attempt at doing a simple DI library based on decorators and their experimental implementation in TypeScript.
As a simplification for the nonce, we leave aside the discovery of values/objects to inject, and hence we assume a simple registry where we can access values / objects by name:

```ts
import { register, resolve} from './registry'

register("a", 42)

resolve("a") // should return 42
```

On top of that, the intend is here to implement the following pattern:

```ts
class Room {
    @inject("a")
    seats: number
}

new Room().seats //42
```

## Follow-ups:

### Discover values by decoration

```ts
@register
class Person {
    @id
    nickname: string
    realname: string

    constructor(nickname: string, realname: string {
        this.nickname = nickname
        this.realname = realname
    }
}

@inject
class Room {
    @named('gto')
    teacher: Person = undefined
}

let gto = new Person('gto', 'Onizuka')

let room = new Room()
room.teacher // === gto
```

### Allow for complex queries at injection point

```ts
@register
class Person {
    @id
    nickname: string
    realname: string

    constructor(nickname: string, realname: string {
        this.nickname = nickname
        this.realname = realname
    }
}

@inject
class Room {
    @named('gto.realname')
    teacher: string = undefined
}

let gto = new Person('gto', 'Onizuka')

let room = new Room()
room.teacher // === 'Onizuka'
```

### Allow for sticky or dynamic injections

```ts
@inject
class Vault {
    // the true is for dynamic injection:
    // The value is resolved at each access.
    @named('secret', true)
    secret: string = undefined
}

let vault = new Vault()
// vault.secret === undefined
register('secret', 42)
// vault.secret === '42'
register('secret', 129)
// vault.secret === '129'
```

### Implement singletons

```ts
@singleton('vault')
class Vault { /**/ }

// This is the only tolerated instance
let vault = new Vault()
let vault2 = new Vault() // Crashes

resolve('vault') // === vault
```

### Hook listeners on instances creations

```ts
type Constructor = new (...args: any[]) => {};
function Gossiper<TBase extends Constructor>(Base: TBase) {
  return class Gossip extends Base {
    @inject('coffee-drinkers', true)
    coffeeDrinkers: worker[]

    @listen(
        and(
            property("brand").is("Starbuck")
            property("menu.items").contains(like("^.*latte.*$")),
        )
    )
    function ratOut(event: Event){
        for(drinker of coffeeDrinkers) {
            drinker.gossip(`A new starbuck opened selling new lattes.`)
        }
    }
  };
}

class Worker {
    function gossip(gossip: string) {/**/}
}

@register
class Store {
    @id
    name: string
    brand: string
    menu: string[]
}

let dan = new Gossiper(Worker)()
let june = new Worker()
let carrie = new Worker()

register('coffee-drinkers', [dan, june, carrie])

new Store('5th Starbucks', 'Starbucks', ['Almond latte', 'Black no sugar'])
// Gossip should start...
```