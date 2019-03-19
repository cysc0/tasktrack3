defmodule Tasktrack3.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tasks" do
    field :assignedby, :string
    field :assignedto, :string
    field :complete, :boolean, default: false
    field :description, :string
    field :duration, :integer

    timestamps()
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:assignedto, :assignedby, :duration, :complete, :description])
    |> validate_required([:assignedto, :assignedby, :duration, :complete, :description])
  end
end
