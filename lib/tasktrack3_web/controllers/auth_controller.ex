defmodule Tasktrack3Web.AuthController do
    use Tasktrack3Web, :controller
  
    alias Tasktrack3.Users
    alias Tasktrack3.Users.User
  
    action_fallback Tasktrack3Web.FallbackController
  
    def authenticate(conn, %{"email" => email, "password" => password}) do
      with {:ok, %User{} = user} <- Users.authenticate_user(email, password) do
        resp = %{
          data: %{
            token: Phoenix.Token.sign(Tasktrack3Web.Endpoint, "user_id", user.id),
            user_id: user.id,
            user_email: user.email
          }
        }
  
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:created, Jason.encode!(resp))
      end
    end
  end
  