Snippets
========

### [ZIO Module Pattern 2.0](https://zio.dev/next/datatypes/contextual/#module-pattern-20)

This example demonstrate how ZIO dependencies can be managed using Module Pattern 2.0.

##### ZIO Type Aliases

| Type        | Has requirement? | Can fail? | Outputs |
| ----------- |:----------------:| ---------:| -------:|
| UIO[A]      |        N         |     N     |    A    |
| URIO[R, A]  |        Y         |     N     |    A    |
| Task[A]     |        N         |     Y     |    A    |
| RIO[R, A]   |        Y         |     Y     |    A    |
| IO[E, A]    |        N         |     Y     |    A    |

##### References
* https://zio.dev/next/howto/migrate/zio-2.x-migration-guide/#module-pattern
* https://zio.dev/next/datatypes/contextual/#module-pattern-20
* https://zio.dev/next/datatypes/contextual/zlayer/#zlayer-example-with-complex-dependencies

```scala
import zio.*
import zio.Clock.*
import zio.Console.printLine

/**
 * A regular case class for this example
 */
case class User(name: String, email: String)

/**
 * UserDatabaseModule mimics a database service to manage users
 */
// Code to interface
trait UserDatabaseModule:
  def insert(user: User): UIO[User]

// Accessor methods inside the companion object
object UserDatabaseModule:
  def insert(user: User): URIO[UserDatabaseModule, User] =
    ZIO.serviceWithZIO(_.insert(user))

// Implementation inside the case class. It is customary to name it with the suffix *Live
case class UserDatabaseLive() extends UserDatabaseModule:
  override def insert(user: User): UIO[User] =
    UIO.succeed({
      println(s"insert into user table (${user.name}, ${user.email})")
      user
    })

// Layer value inside the companion object
// When implementing a service that doesn't have any dependency we need to manually 'extend (() => YourInterface)'
object UserDatabaseLive extends (() => UserDatabaseModule):
  val layer: URLayer[Any, UserDatabaseModule] = UserDatabaseLive.toLayer


/**
 * TemplateModule mimics a template engine
 */
// Code to interface
trait TemplateModule:
  def welcome(user: User): UIO[String]

/*
 * Accessor methods are implemented when needed. The TemplateModule is only used internally by the EmailModule,
 * in this case the dependency injected is going to be injected into EmailModule directly and the accessor
 * method won't be invoked. Therefore, there is not need to create one at the moment.
 */

// Implementation inside the case class. It is customary to name it with the suffix *Live
case class TemplateModuleLive() extends TemplateModule:
  override def welcome(user: User): UIO[String] =
    IO.succeed(s"Hi ${user.name}. Welcome to ZIO.")

// Layer value inside the companion object
// When implementing a service that doesn't have any dependency we need to manually 'extend (() => YourInterface)'
object TemplateModuleLive extends (() => TemplateModule):
  val layer: URLayer[Any, TemplateModule] = TemplateModuleLive.toLayer


/**
 * EmailModule mimics an email service
 */
// Code to interface
trait EmailModule:
  def welcome(user: User): UIO[String]

// Accessor methods inside the companion object
object EmailModule:
  def welcome(user: User): URIO[EmailModule, String] =
    ZIO.serviceWithZIO(_.welcome(user))

// Implementation inside the case class. It is customary to name it with the suffix *Live
case class EmailModuleLive(templateModule: TemplateModule, clock: Clock) extends EmailModule:
  override def welcome(user: User): UIO[String] =
    for {
      dt <- clock.currentDateTime
      body <- templateModule.welcome(user)
      out <- IO.succeed(s"mailto: ${user.email}; at: ${dt.toLocalDate}; body: $body")
    } yield out

// Dependencies are passed via constructors
object EmailModuleLive:
  val layer: URLayer[TemplateModule with Clock, EmailModule] = (EmailModuleLive(_,_)).toLayer[EmailModule]

object ZLayerApp extends ZIOAppDefault:
  // Layers can be composed horizontally and vertically: https://zio.dev/next/datatypes/contextual/zlayer/#vertical-and-horizontal-composition
  // Composing email environment vertically to inject EmailModule dependencies
  val emailEnvironment = TemplateModuleLive.layer >>> EmailModuleLive.layer
  // Composing the remaining environment horizontally
  val environment = emailEnvironment ++ UserDatabaseLive.layer ++ ZLayer.environment[Console]

  override def run =
    val rundown = for {
      u <- UserDatabaseModule.insert(User("Yoshi", "supermarioworld@nintendo.ca"))
      e <- EmailModule.welcome(u)
      _ <- printLine(e)
    } yield ()

    /*
     * The following is written to the console:
     *
     * insert into user (Yoshi, supermarioworld@nintendo.ca
     * mailto: supermarioworld@nintendo.ca; at: 2022-03-07; body: Hi Yoshi. Welcome to ZIO.
     */
    rundown.provideLayer(environment).exitCode

end ZLayerApp
```




Bookmarks
=========

* This doesn't make sense - Scala Loops
https://www.youtube.com/watch?v=BEce72dx-GA&t=660s

* Scala Tutorial 16 - Function Currying in Scala
https://www.youtube.com/watch?v=YEudoVTR02o

* Structuring Services in Scala with ZIO and ZLayer
https://www.youtube.com/watch?v=PaogLRrYo64
