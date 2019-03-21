defmodule Tasktrack3Web.TaskController do
  use Tasktrack3Web, :controller

  alias Tasktrack3.Tasks
  alias Tasktrack3.Tasks.Task
  alias Tasktrack3.Users
  alias Tasktrack3.Repo

  action_fallback Tasktrack3Web.FallbackController

  def index(conn, _params) do
    tasks = Tasks.list_tasks()
    render(conn, "index.json", tasks: tasks)
  end

  def create(conn, %{"task" => task_params}) do
    # should call separate route for editing a task rather can catching here,
    # but time is limited :/
    # so check if a task exists, if it does, edit it rather than create
    if (Map.get(task_params, "id") == nil) do
      task_params = Map.put(task_params, "user", Users.get_user!(Map.get(task_params, "user_id")))
      with {:ok, %Task{} = task} <- Tasks.create_task(task_params) do
        task = Repo.preload(task, :user)
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.task_path(conn, :show, task))
        |> render("show.json", task: task)
      end
    else
      updatetask(conn, Map.get(task_params, "id"), task_params)
    end
  end

  def show(conn, %{"id" => id}) do
    task = Tasks.get_task!(id)
    render(conn, "show.json", task: task)
  end

  def update(conn, %{"id" => id, "task" => task_params}) do
    task = Tasks.get_task!(id)

    with {:ok, %Task{} = task} <- Tasks.update_task(task, task_params) do
      render(conn, "show.json", task: task)
    end
  end

  def updatetask(conn, id, task_params) do
    task = Tasks.get_task!(id)

    with {:ok, %Task{} = task} <- Tasks.update_task(task, task_params) do
      render(conn, "show.json", task: task)
    end
  end

  def delete(conn, %{"id" => id}) do
    task = Tasks.get_task!(id)

    with {:ok, %Task{}} <- Tasks.delete_task(task) do
      send_resp(conn, :no_content, "")
    end
  end
end
