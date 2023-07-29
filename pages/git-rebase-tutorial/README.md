Git Rebase Tutorial
===================
I find Git rebase to be very different from Git merge. So, I decided to create a step-by-step to practice and illustrate how it works.

*Note*: The `#:` represents my comments whereas `#>` indicates the console output.

```bash

#: =========================
#: Let's create our local repository
#: =========================

#: Creates a directory named git-rebase-tutorial
mkdir git-rebase-tutorial

#: Changes to directory git-rebase-tutorial
cd git-rebase-tutorial/

#: Initilizes a local git repository
git init
#> Initialized empty Git repository in /home/lukard/dev/git-rebase-tutorial/.git/


#: =========================
#: Let's create one file and commit the changes
#: =========================

#: Appends the text "m1" to tutorial-file1.txt
echo "m1" >> tutorial-file1.txt

#: Adds the file to git index
git add tutorial-file1.txt 

#: Commits all changes with the message "Developed m1"
git commit -a -m "Developed m1"
#> [master (root-commit) 672be4a] Developed m1
#>  1 file changed, 1 insertion(+)
#>  create mode 100644 tutorial-file1.txt


#: =========================
#: Let's create a new branch, create one file and commit the changes
#: =========================

#: Creates a new branch and moves to it
git checkout -b tutorial-branch
#> Switched to a new branch 'tutorial-branch'

#: Appends the text "b1" to tutorial-file2.txt
echo "b1" >> tutorial-file2.txt

git add tutorial-file2.txt

git commit -a -m "Developed b1"
#> [tutorial-branch 5ea6cf3] Developed b1
#>  1 file changed, 1 insertion(+)
#>  create mode 100644 tutorial-file2.txt

echo "b2" >> tutorial-file2.txt

git commit -a -m "Developed b2"


#: =========================
#: Now, let's go back to master and make other changes
#: =========================

git checkout master
#> Switched to branch 'master'

echo "m2" >> tutorial-file1.txt 

git commit -a -m "Developed m2"
#> [master e899673] Developed m2
#>  1 file changed, 1 insertion(+)

git checkout tutorial-branch 
#> Switched to branch 'tutorial-branch'


#: =========================
#: Finally, let's rebase the content from master into the tutorial-branch
#: During the process we also wanto to squash commits b1 and b2
#: We want our branch to look like: m1, m2, [b1 & b2]
#: =========================

#: Shows the log from master
git log master --pretty=format:"%h - %ar - %s"
#> e899673 - 80 seconds ago - Developed m2
#> 672be4a - 4 minutes ago - Developed m1

#: Shows the log from tutorial-branch
git log tutorial-branch --pretty=format:"%h - %ar - %s"
#> 0d3eaf0 - 2 minutes ago - Developed b2
#> 5ea6cf3 - 3 minutes ago - Developed b1
#> 672be4a - 4 minutes ago - Developed m1


#: Rebases the content from master into tutorial-branch
git rebase -i master tutorial-branch


#: =========================
#: Git will prompt you with a text editor.
#: Here you can squash b1 and b2 together
#: =========================

#> pick 5ea6cf3 Developed b1
#> squash 0d3eaf0 Developed b2
#>
#> # Rebase e899673..0d3eaf0 onto e899673
#> #
#> # Commands:
#> #  p, pick = use commit
#> #  r, reword = use commit, but edit the commit message
#> #  e, edit = use commit, but stop for amending
#> #  s, squash = use commit, but meld into previous commit
#> #  f, fixup = like "squash", but discard this commit's log message
#> #  x, exec = run command (the rest of the line) using shell
#> #
#> # These lines can be re-ordered; they are executed from top to bottom.
#> #
#> # If you remove a line here THAT COMMIT WILL BE LOST.
#> #
#> # However, if you remove everything, the rebase will be aborted.
#> #
#> # Note that empty commits are commented out


#: =========================
#: Git will prompt you with a text editor.
#: Here you can change the resulting commit message.
#: =========================

#> # This is a combination of 2 commits.
#> # The first commit's message is:
#> 
#> Developed b1
#> 
#> # This is the 2nd commit message:
#> 
#> Developed b2
#> 
#> # Please enter the commit message for your changes. Lines starting
#> # with '#' will be ignored, and an empty message aborts the commit.
#> # rebase in progress; onto e899673
#> # You are currently editing a commit while rebasing branch 'tutorial-branch' on 'e899673'.
#> #
#> # Changes to be committed:
#> #       new file:   tutorial-file2.txt
#> #


#: =========================
#: Git will also dispaly the end result of the rebase.
#: =========================

#> [detached HEAD cfdd39d] Developed b1
#>  1 file changed, 2 insertions(+)
#>  create mode 100644 tutorial-file2.txt
#> Successfully rebased and updated refs/heads/tutorial-branch.


#: =========================
#: If we check the logs, we can see that we achieved: m1, m2, [b1 & b2]
#: =========================

git log
#> commit cfdd39dd120f9b1c2ce72ea6d43302f3b0aa3ef7
#> Author: Rafa <rafa>
#> Date:   Sat Apr 2 19:29:20 2016 -0400
#> 
#>     Developed b1
#>     
#>     Developed b2
#> 
#> commit e899673500abfc515b4c3c0cb3e4e8965c98087e
#> Author: Rafa <rafa>
#> Date:   Sat Apr 2 19:30:51 2016 -0400
#> 
#>     Developed m2
#> 
#> commit 672be4a2b10d93503f3ad0d2e08d1b2069ed1c7c
#> Author: Rafa <rafa>
#> Date:   Sat Apr 2 19:28:20 2016 -0400
#> 
#>     Developed m1
```