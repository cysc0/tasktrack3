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
      plug :fetch_session
      plug :fetch_flash
      plug Tasktrack3Web.Plugs.FetchSession
    end
  
    scope "/", Tasktrack3Web do
      pipe_through :browser # Use the default browser stack
  
      get "/", PageController, :index

      resources "/sessions", SessionController, only: [:create, :delete], singleton: true
    end
  
    # Other scopes may use custom stacks.
    # scope "/api", Tasktrack3Web do
    #   pipe_through :api
    # end
  end
  