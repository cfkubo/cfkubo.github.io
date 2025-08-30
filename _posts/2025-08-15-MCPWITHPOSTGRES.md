---
title: Supercharging Private AI with MCP and PostgreSQL
date: 2025-08-15 01:01:01 +/-TTTT
categories: [ollama, ai, postgres, local ai , mcp , ai agents ]
tags: [model fine tunning, ollama, ai, huggingface, python, pytroch , mcp , ai agents ]     # TAG names should always be lowercase
---

<script data-goatcounter="https://arulwebsite.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>

<script>
    // Append to the <body>; can use a CSS selector to append somewhere else.
    window.goatcounter.visit_count({append: 'body'})
</script>


# Supercharging Private AI with MCP and PostgreSQL: A Practical Guide

Imagine harnessing the power of open-source LLMs on your own hardware, seamlessly connecting them to your PostgreSQL database, and interacting through a beautiful web UI—all without sending your data to the cloud. With the **Ollama-MCP Bridge WebUI** and the Model Context Protocol (MCP), this is not just possible, but easy and extensible.

In this post, we’ll show you how to use the MCP server ecosystem to connect your local LLM (via Ollama) to a PostgreSQL database, unlocking advanced AI-driven data analysis, querying, and automation—all from your browser.

---

## Why Use MCP with Databases?

- **Privacy**: Your data never leaves your machine.
- **Flexibility**: Use any open-source LLM supported by Ollama.
- **Extensibility**: Add new tools (like database connectors) with minimal code.
- **Unified Interface**: Interact with files, the web, and databases from one chat UI.

---

## What is MCP?

The [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol) is an open standard for connecting LLMs to external tools—like search engines, filesystems, or databases. Each tool runs as a server, exposing a simple API. The bridge orchestrates these tools, letting the LLM decide which to use for each user query.

---

## Project Overview

This project, **Ollama-MCP Bridge WebUI**, provides:

- A TypeScript backend that connects Ollama to any MCP server (including databases)
- A clean web UI for chat and tool interaction
- Easy configuration and extensibility

---

## Adding PostgreSQL as an MCP Tool

To connect your LLM to PostgreSQL, you’ll need an MCP server that exposes your database as a tool. The [@modelcontextprotocol/server-postgres](https://www.npmjs.com/package/@modelcontextprotocol/server-postgres) package does exactly this.

### 1. Install the PostgreSQL MCP Server

```bash
npm install @modelcontextprotocol/server-postgres
```

### 2. Update `bridge_config.json`

Add a new entry for your Postgres server:

```json
{
  "mcpServers": {
    ...existing servers...,
    "postgres": {
      "command": "node",
      "args": [
        "node_modules/@modelcontextprotocol/server-postgres/dist/index.js"
      ],
      "env": {
        "PGHOST": "$PGHOST",
        "PGUSER": "$PGUSER",
        "PGPASSWORD": "$PGPASSWORD",
        "PGDATABASE": "$PGDATABASE",
        "PGPORT": "$PGPORT"
      }
    }
  },
  ...other config...
}
```

### 3. Add Database Credentials to `.env`

```
PGHOST=localhost
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=your_db_name
PGPORT=5432
```

### 4. Restart the Bridge

```bash
./start.bat
```

---

## Example: Chatting with Your Database

Open [http://localhost:8080](http://localhost:8080) and try queries like:

- “Show me the top 5 customers by revenue.”
- “How many orders were placed last month?”
- “Add a new user with email alice@example.com.”

The LLM will automatically detect when to use the Postgres tool, generate SQL, and return results—all with full transparency.

---

## How It Works

1. **User Query**: You ask a question in the web UI.
2. **Tool Selection**: The bridge analyzes your query and decides if it needs to use the Postgres tool.
3. **MCP Call**: The bridge sends your request to the Postgres MCP server, which runs the SQL and returns results.
4. **LLM Response**: The LLM summarizes, explains, or visualizes the data as needed.

---

## Security & Best Practices

- Use a dedicated database user with limited permissions.
- Never expose your MCP servers to the public internet.
- Audit LLM-generated SQL before running in production environments.

---

## Extending Further

- Add more MCP tools (e.g., Redis, MongoDB, APIs).
- Chain tools together for complex workflows (e.g., fetch data, analyze, write report).
- Customize the system prompt to guide the LLM’s behavior.

---

## Conclusion

With MCP and the Ollama-MCP Bridge WebUI, you can build a **private, extensible, and powerful AI assistant** that works with your own data—including PostgreSQL—right from your desktop. No cloud required.

**Ready to try?**  
Clone the [repo](https://github.com/cfkubo/Ollama-MCP-Bridge-WebUI), add the Postgres MCP server, and start chatting with your database today!

