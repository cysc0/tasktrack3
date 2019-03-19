defmodule Tasktrack3.Repo do
    use Ecto.Repo,
      otp_app: :tasktrack3,
      adapter: Ecto.Adapters.Postgres
  end
  