Gradle Cheat Sheet
==================

[Gradle Build Language Reference](https://docs.gradle.org/current/dsl/)

Commands
--------
```
# List all task
gradle tasks --all

# Run tasks
gradle task1 task2 task3

# Status of any deamon running in the background
gradle --status
```

### Properties
Gradle properties can be set via a file named `gradle.properties`. Various ways to set properties are described in the [Build Environment](https://docs.gradle.org/current/userguide/build_environment.html) documentation.


Snippets
========
Working with properties and variables
```
ext.myExtendedProperty = "My extended property"
def myVariable = "My variable"

task task2 {
    doFirst {
        println "Task 2 doFirst"
    }
}


task task3 {
    description "This is task 3" +
            " with '$myVariable' and '$myExtendedProperty'" +
            " which depends on $task2"
    dependsOn {
        task2
    }
    doLast {
        println "Task 3 doLast widh description: $description"
    }
}
```
```
$ gradle task3

> Task :task2 
Task 2 doFirst

> Task :task3 
Task 3 doLast widh description: This is task 3 with 'My variable' and 'My extended property' which depends on task ':task2'


BUILD SUCCESSFUL in 0s
2 actionable tasks: 2 executed
```
