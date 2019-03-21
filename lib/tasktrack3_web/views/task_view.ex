defmodule Tasktrack3Web.TaskView do
  use Tasktrack3Web, :view
  alias Tasktrack3Web.TaskView

  def render("index.json", %{tasks: tasks}) do
    %{data: render_many(tasks, TaskView, "task.json")}
  end

  def render("show.json", %{task: task}) do
    %{data: render_one(task, TaskView, "task.json")}
  end

  def render("task.json", %{task: task}) do
    %{id: task.id,
      complete: task.complete,
      title: task.title,
      description: task.description,
      duration: task.duration,
      user_email: task.user.email,
      user_id: task.user.id}
  end
end
