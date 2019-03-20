defmodule Tasktrack3Web.PageController do
  use Tasktrack3Web, :controller
  
  def index(conn, _params) do
    users = Tasktrack3.Users.list_users()
    IO.inspect(users)
    render conn, "index.html", users: users
  end
end
