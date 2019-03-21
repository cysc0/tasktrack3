# Tasktrack

**TODO: Add description**

## Installation

If [available in Hex](https://hex.pm/docs/publish), the package can be installed
by adding `tasktrack` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:tasktrack3, "~> 0.1.0"}
  ]
end
```

Documentation can be generated with [ExDoc](https://github.com/elixir-lang/ex_doc)
and published on [HexDocs](https://hexdocs.pm). Once published, the docs can
be found at [https://hexdocs.pm/tasktrack](https://hexdocs.pm/tasktrack).


# TODO:

requirements:
task creation/edits
  schema:
    owner: user_id (reassignable)
    status: boolean
    description: string
    title: string
    time: int (0..15...)


-----

fixes/enhancements:

figure out sessions, so that a page reload doesn't logout?
figure out the weird page reload breakage