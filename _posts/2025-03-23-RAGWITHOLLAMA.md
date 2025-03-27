---
title: RAG with Ollama
date: 2025-03-23 01:01:01 +/-TTTT
categories: [ollama, rag]
tags: [ai, ollama]     # TAG names should always be lowercase
---
<!-- 
<script data-goatcounter="https://arulwebsite.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script> -->

<script data-goatcounter="https://arulwebsite.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>


<script>
    // Append to the <body>; can use a CSS selector to append somewhere else.
    window.goatcounter.visit_count({append: 'body'})
</script>


# Demo Application: Local RAG Chatbot with Ollama and LlamaIndex

This project demonstrates how to create a local Retrieval Augmented Generation (RAG) chatbot using Ollama for running Large Language Models (LLMs) and LlamaIndex for data indexing and retrieval. The chatbot allows users to upload documents (PDFs, text files, JSON, HTML, DOCX, CSV) and ask questions about their content.

## Overview

In today's AI-driven world, accessing and processing information efficiently is crucial. This project leverages the power of local LLMs and vector store indexing to enable users to interact with their documents in a conversational manner. By combining Ollama's ability to run LLMs locally with LlamaIndex's robust data indexing, we create a powerful tool for knowledge retrieval and question answering.

![ragappimage](/static/ragapp.png)

## Features

* **Local LLM with Ollama:** Utilizes Ollama to run LLMs locally, ensuring data privacy and reducing reliance on external APIs.
* **Document Upload and Processing:** Supports various file formats (PDF, TXT, JSON, CSV, MD, HTML, DOCX) for document upload.
* **LlamaIndex Integration:** Employs LlamaIndex to index uploaded documents and perform efficient retrieval.
* **Vector Store Indexing:** Uses vector embeddings to represent document content, enabling semantic search and retrieval.
* **Gradio Interface:** Provides a user-friendly chat interface for interacting with the chatbot.
* **Dynamic Model Detection:** Automatically detects and uses a running Ollama model or defaults to `llama2:latest`.
* **Timeout Client for Ollama:** Includes a timeout feature for the Ollama client to handle long queries.

## Dependencies

* `llama-index`: For data indexing and retrieval.
* `ollama`: For running local LLMs.
* `gradio`: For creating the user interface.
* `sentence-transformers`: For generating document embeddings.

## Setup and Installation

1.  **Install Ollama:**
    * Follow the installation instructions on the official Ollama website to set up Ollama on your local machine.
2.  **Pull an LLM:**
    * Open a terminal and pull the desired LLM using Ollama. For example: `ollama pull llama2`
3.  **Install Python Dependencies:**
    * Create a virtual environment (recommended): `python3 -m venv venv`
    * Activate the virtual environment: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows).
    * Install the required packages: `pip install llama-index ollama gradio sentence-transformers`
4.  **Run the Script:**
    * Execute the Python script: `python rag-ollama-all-local.py`
5.  **Access the Chatbot:**
    * Open your web browser and navigate to the URL displayed in the terminal.

## Running it locally

1. Clone the repository
```
git clone https://github.com/cfkubo/ollama-rag-chat
cd ollama-rag-chat
```

2. Create a virtual environment and activate it
```
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies using pip
```
pip3 install -r requirements.txt
```

4. Run ollama or use other ollama models
```
ollama run llama2:latest
```
5. Login to Hugginface acount
```
huggingface-cli login
```
6. Run the application
```
python3 rag-ollama-all-local.py
```

## Code Explanation

The script performs the following key tasks:

1.  **Imports Necessary Libraries:** Imports required libraries for LLM interaction, data indexing, and user interface.
2.  **Configures Logging:** Sets up logging for debugging and monitoring.
3.  **Defines Timeout Client:** Creates a custom Ollama client with a timeout setting.
4.  **Detects Running Ollama Model:** Uses `ps -ef` to detect if an Ollama model is already running and uses it.
5.  **Configures Ollama LLM and Embedding Model:** Initializes the Ollama LLM and HuggingFace embedding model.
6.  **Configures LlamaIndex Settings:** Sets the LLM and embedding model for LlamaIndex.
7.  **Defines the `answer` Function:**
    * Handles user queries and document uploads.
    * If documents are uploaded, it uses LlamaIndex to index and query the documents.
    * If no documents are uploaded, it uses the LLM directly to answer the query.
8.  **Creates Gradio Interface:** Sets up a chat interface using Gradio for user interaction.
9.  **Launches the Gradio Application:** Starts the Gradio server.

## Usage

1.  Open the web interface.
2.  Upload documents using the file upload feature.
3.  Ask questions related to the uploaded documents.
4.  The chatbot will provide answers based on the document content.
5.  If no document is uploaded, you can still chat with the LLM directly.

## Future Improvements

* **Persistent Vector Store:** Implement a persistent vector store to avoid re-indexing documents on each interaction.
* **Enhanced Error Handling:** Improve error handling and provide more informative error messages.
* **User Authentication:** Add user authentication for secure access.
* **Improved User Interface:** Enhance the user interface for a better user experience.
* **Containerize:** Update the application to run in Docker, k8s and Cloud Foundry.

This project provides a foundation for building powerful local RAG chatbots. By leveraging Ollama and LlamaIndex, you can create customized solutions for knowledge retrieval and question answering tailored to your specific needs.


[Github Project](https://github.com/cfkubo/ollama-rag-chat)


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
