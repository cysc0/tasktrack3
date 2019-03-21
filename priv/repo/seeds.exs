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

admin = %User{email: "admin@example.com", admin: true, password_hash: Argon2.hash_pwd_salt("admin")}
task = %Task{complete: true, title: "A test task", description: "admin, do this task", duration: 45, user: admin}
Repo.insert!(task)