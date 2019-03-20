defmodule Tasktrack3Web.UserView do
  use Tasktrack3Web, :view
  alias Tasktrack3Web.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      admin: user.admin,
      email: user.email}
  end
end
