---
title: AI Patterns I See Everywhere
date: 2025-08-03 01:01:01 +/-TTTT
categories: [ollama, ai, model fine-tune, python, pytorch, local ai, mcp, ai agents]
tags: [model fine-tuning, ollama, ai, huggingface, python, pytorch, mcp, ai agents]     # TAG names should always be lowercase
---

<script data-goatcounter="https://arulwebsite.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>

<script>
    // Append to the <body>; can use a CSS selector to append somewhere else.
    window.goatcounter.visit_count({append: 'body'})
</script>

# From Monolith to Micro: A Pattern I See Everywhere

Lately, I've been thinking about the fundamental patterns that shape how technology evolves. It seems like the most effective way to improve performance, increase flexibility, and handle scale is to take something big, monolithic, and all-encompassing, and break it down into smaller, specialized pieces.

This isn't just a theory I've cooked up; I see this pattern repeating itself across different eras of technology. It happened with hardware, it's a core concept in software, and I believe it's happening right now with the evolution of AI.

## The Hardware Evolution

Think back to the earliest days of computing. We had massive mainframe computers—true monoliths of technology. A single, gigantic machine handled everything. If one part failed, the whole thing could go down. While they were incredibly powerful, they were also rigid, expensive, and a complete pain to maintain. They simply couldn't scale in a way that was accessible to everyone.

Then, everything changed. We moved from the centralized mainframe to the decentralized power of the personal computer. Suddenly, everyone had their own CPU, memory, and storage. It was a completely different model. PCs and, later, smartphones proved that by distributing the processing power, you could unlock incredible innovation and reach an entirely new level of scale.

## The Software I Wrote

The same exact pattern played out in software development. For years, we built monolithic applications. Everything—the user interface, the business logic, the database connections—was bundled into one massive codebase. This approach was fine for a simple app, but as soon as the application grew, it became a nightmare. A single bug could take down the entire system, and a small update required you to re-build and re-deploy everything.

That's why the industry moved to microservices. Instead of one giant application, we started building a collection of small, independent services. Each one does one thing and does it well. The authentication service handles logins, the payment service handles transactions, and so on. This approach gives us the flexibility to update one part of the system without touching the others. It's more resilient, easier to scale, and allows our teams to move much faster.

### Personal Computers & Mobile Devices: 

The rise of the PC and, later, smartphones represents a move from a centralized mainframe to a distributed, personal computing model. Each device is a self-contained unit with its own CPU, memory, and storage, but it can connect and interact with a vast network of other devices and services. This modularity democratized computing and enabled massive innovation.

### Microservices Architecture: 

This is the software equivalent of the shift to personal computing. Instead of one large application, the system is broken down into a collection of small, independent services. Each microservice is responsible for a single business capability (e.g., user authentication, payment processing) and can be developed, deployed, and scaled independently. This allows for more frequent updates, better fault isolation, and the ability to use different technologies for different services.



## The AI I'm Working With Now

This is where the pattern gets really interesting. I see this exact same evolution happening with artificial intelligence.

When I look at the incredible large language models (LLMs) we have today, they feel like the new monoliths. They're powerful, yes, but they're also computationally expensive and difficult to manage. You can't just fix one part of the model without retraining the whole thing. They are a single, gigantic brain trying to do everything at once.


### Monolithic AI Models: 

Early large language models (LLMs) and other AI systems were often seen as monolithic. A single, massive model was responsible for handling all tasks. While incredibly powerful, these models are computationally expensive to run, difficult to fine-tune for specific tasks, and can suffer from a "black box" problem where it's hard to understand their reasoning.

### Modular AI & AI Agents: 

The emerging trend in AI is towards a more modular, multi-agent architecture. Instead of one giant model, systems are being built with specialized AI agents that work together. For example, one agent might be responsible for data retrieval, another for complex reasoning, and a third for generating a final response. This approach, sometimes called "agentic workflows" or "compound AI systems," offers several key advantages:

- **Specialization:** Each agent can be highly optimized for its specific task.

- **Scalability:** You can scale individual agents without having to re-run the entire, massive model.

- **Explainability:** By breaking down the problem into steps, the system's reasoning becomes more transparent.

But I believe the future of AI isn't in bigger and bigger monoliths. Instead, it's in a more modular, composable, and collaborative architecture. We're already moving toward systems where different AI agents work together. One agent retrieves information from the web, another agent reasons through the problem, and a third agent writes the final response.

This move from monolithic AI to modular AI agents will unlock the same benefits we saw in hardware and software: greater efficiency, better scalability, and a more robust and resilient system.

You can argue that the evolution of AI is following a similar pattern, moving from large, general-purpose models to a more modular, composable, and specialized approach.

What do you think? Have you noticed this same pattern in other areas of technology or even outside of the tech world?

<script src="https://giscus.app/client.js"
        data-repo="cfkubo/cfkubo.github.io"
        data-repo-id="R_kgDOONa2fg"
        data-category="General"
        data-category-id="DIC_kwDOONa2fs4CofaO"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="dark_high_contrast"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>

