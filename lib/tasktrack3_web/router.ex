defmodule Tasktrack3Web.Router do
  use Tasktrack3Web, :router
  
  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Tasktrack3Web.Plugs.FetchSession
  end
  
  pipeline :api do
    plug :accepts, ["json"]
  end
  
  scope "/", Tasktrack3Web do
    pipe_through :browser # Use the default browser stack
    
    get "/", PageController, :index
    get "/users", PageController, :index
  end
  
  # Other scopes may use custom stacks.
  scope "/api/v1", Tasktrack3Web do
    pipe_through :api
    
    resources "/users", UserController, except: [:new, :edit]
    resources "/tasks", TaskController
    post "/auth", AuthController, :authenticate
  end
end