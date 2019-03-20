defmodule Tasktrack3Web.AuthController do
  use Tasktrack3Web, :controller
  
  alias Tasktrack3.Users
  alias Tasktrack3.Users.User
  
  action_fallback Tasktrack3Web.FallbackController
  
  # Authentication when this is a login, so check exisiting user ...
  def authenticate(conn, %{"email" => email, "password" => password, "newUser" => newUser}) when newUser == false do
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

  # Authentication when this is a signup, so hash pass etc, create new user
  def authenticate(conn, %{"email" => email, "password" => password, "newUser" => newUser}) when newUser == true do
    checkExistingUser = Users.get_user_by_email(email)
    if checkExistingUser == nil do
      # this email is not claimed, so this user can be created
      with {:ok, %User{} = user} <- Users.create_user(%{email: email, password: password}) do
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
    else
      # this account already exists, don't allow this creation
      {:error, "invalid user-identifier"}
    end
  end
end
