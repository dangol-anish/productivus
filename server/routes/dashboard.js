const router = require("express").Router();
const authorization = require("../middlwares/authorization");
const pool = require("../models/database");

// Get all todos for the authenticated user
router.get("/", authorization, async (req, res) => {
  try {
    const query = `
      SELECT users.user_name, todos.todo_id, todos.description
      FROM users
      LEFT JOIN todos ON users.user_id = todos.user_id
      WHERE users.user_id = $1`;

    const allTodos = await pool.query(query, [req.user.id]);

    res.json({ user: req.user, todos: allTodos.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Create a new todo
router.post("/todos", authorization, async (req, res) => {
  try {
    const { description } = req.body;
    const query = `
      INSERT INTO todos (user_id, description)
      VALUES ($1, $2)
      RETURNING *`;

    const newTodo = await pool.query(query, [req.user.id, description]);

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update a todo
router.put("/todos/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const query = `
      UPDATE todos
      SET description = $1
      WHERE todo_id = $2 AND user_id = $3
      RETURNING *`;

    const updateTodo = await pool.query(query, [description, id, req.user.id]);

    if (updateTodo.rows.length === 0) {
      return res.json("This todo does not belong to you");
    }

    res.json("Todo was updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a todo
router.delete("/todos/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      DELETE FROM todos
      WHERE todo_id = $1 AND user_id = $2
      RETURNING *`;

    const deleteTodo = await pool.query(query, [id, req.user.id]);

    if (deleteTodo.rows.length === 0) {
      return res.json("This todo does not belong to you");
    }

    res.json("Todo was deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
