defmodule Tasktrack3.TasksTest do
  use Tasktrack3.DataCase

  alias Tasktrack3.Tasks

  describe "tasks" do
    alias Tasktrack3.Tasks.Task

    @valid_attrs %{assignedby: "some assignedby", assignedto: "some assignedto", complete: true, description: "some description", duration: 42}
    @update_attrs %{assignedby: "some updated assignedby", assignedto: "some updated assignedto", complete: false, description: "some updated description", duration: 43}
    @invalid_attrs %{assignedby: nil, assignedto: nil, complete: nil, description: nil, duration: nil}

    def task_fixture(attrs \\ %{}) do
      {:ok, task} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Tasks.create_task()

      task
    end

    test "list_tasks/0 returns all tasks" do
      task = task_fixture()
      assert Tasks.list_tasks() == [task]
    end

    test "get_task!/1 returns the task with given id" do
      task = task_fixture()
      assert Tasks.get_task!(task.id) == task
    end

    test "create_task/1 with valid data creates a task" do
      assert {:ok, %Task{} = task} = Tasks.create_task(@valid_attrs)
      assert task.assignedby == "some assignedby"
      assert task.assignedto == "some assignedto"
      assert task.complete == true
      assert task.description == "some description"
      assert task.duration == 42
    end

    test "create_task/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Tasks.create_task(@invalid_attrs)
    end

    test "update_task/2 with valid data updates the task" do
      task = task_fixture()
      assert {:ok, %Task{} = task} = Tasks.update_task(task, @update_attrs)
      assert task.assignedby == "some updated assignedby"
      assert task.assignedto == "some updated assignedto"
      assert task.complete == false
      assert task.description == "some updated description"
      assert task.duration == 43
    end

    test "update_task/2 with invalid data returns error changeset" do
      task = task_fixture()
      assert {:error, %Ecto.Changeset{}} = Tasks.update_task(task, @invalid_attrs)
      assert task == Tasks.get_task!(task.id)
    end

    test "delete_task/1 deletes the task" do
      task = task_fixture()
      assert {:ok, %Task{}} = Tasks.delete_task(task)
      assert_raise Ecto.NoResultsError, fn -> Tasks.get_task!(task.id) end
    end

    test "change_task/1 returns a task changeset" do
      task = task_fixture()
      assert %Ecto.Changeset{} = Tasks.change_task(task)
    end
  end
end
