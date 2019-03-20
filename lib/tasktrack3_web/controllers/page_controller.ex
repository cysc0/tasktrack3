defmodule Tasktrack3Web.PageController do
  use Tasktrack3Web, :controller
  
  def index(conn, _params) do
    render conn, "index.html"
  end
end
