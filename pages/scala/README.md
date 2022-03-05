Snippets
========

[ZIO Module Pattern 2.0](https://zio.dev/next/datatypes/contextual/#module-pattern-20)

```scala
import zio.*
import zio.Clock.*
import zio.Console.printLine

/**
 * A regular case class for this example
 */
case class User(name: String, email: String)

/*
 * In this example we have two ZIO modules: UserDatabaseModule and EmailModule.
 * They follow Module Pattern 2.0, See:
 * - https://zio.dev/next/howto/migrate/zio-2.x-migration-guide/#module-pattern
 * - https://zio.dev/next/datatypes/contextual/#module-pattern-20
 * - https://zio.dev/next/datatypes/contextual/zlayer/#zlayer-example-with-complex-dependencies
 *
 * Zio Effects
 *
 * UIO[A] alias for ZIO[Any, Nothing, A]: an Unexceptional effect that doesn't require any specific environment, and cannot fail, but can succeed with an A.
 * URIO[R, A] alias for ZIO[R, Nothing, A]: an effect that requires an R, and cannot fail, but can succeed with an A.
 *
 * Task[A] alias for ZIO[Any, Throwable, A]: an effect that has no requirements, and may fail with a Throwable value, or succeed with an A.
 *
 * IO[E, A] alias for ZIO[Any, E, A]: an effect that has no requirements, and may fail with an E, or succeed with an A.
 * RIO[R, A] alias for ZIO[R, Throwable, A]: an effect that requires an R, and may fail with a Throwable value, or succeed with an A.
 */

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
      println(s"insert into user (${user.name}, ${user.email}")
      user
    })

// Layer value inside the companion object
object UserDatabaseLive extends (() => UserDatabaseModule):
  // When implementing a service that doesn't have any dependency we need to manually 'extend () => YourInterface'
  val layer: URLayer[Any, UserDatabaseModule] = UserDatabaseLive.toLayer

/**
 * EmailModule mimics an email service
 */
// Code to interface
trait EmailModule:
  def welcome(email: String): UIO[String]

// Accessor methods inside the companion object
object EmailModule:
  def welcome(email: String): URIO[EmailModule, String] =
    ZIO.serviceWithZIO(_.welcome(email))

// Implementation inside the case class. It is customary to name it with the suffix *Live
case class EmailModuleLive(clock: Clock) extends EmailModule:
  override def welcome(email: String): UIO[String] =
    for {
      dt <- clock.currentDateTime
      out <- IO.succeed(s"mailto: $email; at: $dt; body: Welcome to ZIO")
    } yield out

// Dependencies are passed via constructors
object EmailModuleLive:
  val layer: URLayer[Clock, EmailModule] = (EmailModuleLive(_)).toLayer[EmailModule]

object ZLayerApp extends ZIOAppDefault:
  // Layers can be composed horizontally and vertically: https://zio.dev/next/datatypes/contextual/zlayer/#vertical-and-horizontal-composition
  val env = EmailModuleLive.layer ++ UserDatabaseLive.layer ++ ZLayer.environment[Console]

  override def run =
    val rundown = for {
      u <- UserDatabaseModule.insert(User("Yoshi", "supermarioworld@nintendo.ca"))
      e <- EmailModule.welcome(u.email)
      _ <- printLine(e)
    } yield ()
    rundown.provideLayer(env).exitCode

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
