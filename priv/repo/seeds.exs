# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Tasktrack3.Repo.insert!(%Tasktrack3.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Tasktrack3.Repo
alias Tasktrack3.Users.User
alias Tasktrack3.Tasks.Task


pwhash = Argon2.hash_pwd_salt("pass1")
alice = %User{email: "alice@example.com", admin: true, password_hash: pwhash}
Repo.insert!(alice)
bob = %User{email: "bob@example.com", admin: false, password_hash: pwhash}

atask = %Task{complete: false, title: "TEST TASK", description: "a test task", duration: 30, user: alice}
atask2 = %Task{complete: false, title: "BOBTASK", description: "a task for bob", duration: 45, user: bob}
Repo.insert!(atask2)

Repo.insert!(atask)
Repo.insert!(atask)
Repo.insert!(atask)
Repo.insert!(atask)
Repo.insert!(atask)
Repo.insert!(atask)
Repo.insert!(atask)
Repo.insert!(atask)
Repo.insert!(atask)