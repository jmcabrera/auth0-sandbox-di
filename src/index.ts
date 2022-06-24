import { inject, register, named } from './registry'
import { track } from './track'

register('teacher', 'Hi, I am John')

@inject
class Room {
  @named('teacher')
  @track('tracking')
  teacher: string = "default value if missing"
}

const a = new Room()
console.log(a.teacher)
a.teacher = "Now I'm Bill"
console.log(a.teacher)
register('teacher', "Hey there, I'm Jane")
console.log(a.teacher)
