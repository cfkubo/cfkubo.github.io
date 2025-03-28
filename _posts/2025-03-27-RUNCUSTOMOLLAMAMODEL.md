---
title: Running GGUF model with Ollama - PART II
date: 2025-03-27 01:01:01 +/-TTTT
categories: [ollama, model fine tune, python, pytroch ]
tags: [model fine tunning, ollama, ai, huggingface, python, pytroch ]     # TAG names should always be lowercase
---
<script data-goatcounter="https://arulwebsite.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>

<script>
    // Append to the <body>; can use a CSS selector to append somewhere else.
    window.goatcounter.visit_count({append: 'body'})
</script>

# Unleash the Power of Local LLMs: Converting Hugging Face Models to GGUF and Running with Ollama

The world of Large Language Models (LLMs) is rapidly evolving, and Hugging Face has become the go-to hub for accessing a vast library of pre-trained models. But what if you want to take these powerful models offline and run them locally on your machine? That's where GGUF and Ollama come into play!

This blog post will guide you through the exciting process of converting Hugging Face models or your own fine tuned model which are in GGUF format and then running them seamlessly with Ollama. Get ready to harness the power of LLMs right on your local hardware, without relying on cloud services. This would allow you have test groud locally to palyaround your fine tuned models.

## Why GGUF and Ollama?

* **GGUF (GGML Universal Format):** This is a quantization format specifically designed for efficient inference of LLMs on CPUs (and GPUs with projects like llama.cpp). It allows you to run large models on consumer-grade hardware by reducing their memory footprint and computational demands.
* **Ollama:** Think of Ollama as your local LLM containerization and runtime. It makes it incredibly easy to download, manage, and run open-source LLMs like Llama 3, Mistral, and many others – including your custom GGUF conversions! Ollama handles all the complexities of setting up and running these models with simple commands.

## The Journey: From Hugging Face to Local Inference

Here's a roadmap of what we'll cover:

1.  **Choosing Your Hugging Face Model:** Select a model that piques your interest from the vast Hugging Face Hub ([https://huggingface.co/models](https://huggingface.co/models)). Keep in mind the resource requirements of the original model, as even after quantization, larger models will still require more RAM to run effectively.

2.  **Converting to GGUF:** This is a crucial step. While some models are already available in GGUF format (often found on repositories like TheBloke's on Hugging Face), you might want to convert others yourself. This typically involves using tools like `llama.cpp`. We won't delve into the manual conversion process in this blog post to keep it focused, but there are excellent resources available online that detail this process. Look for guides on using `llama.cpp` and its Python bindings to convert Hugging Face transformer models to GGUF.

3.  **Using the Provided Python Script for Local Ollama Integration:** We'll leverage the provided Python script to streamline the process of making your GGUF model accessible and runnable by Ollama.

## Let's Dive into the Script

Python script that allows you to run your fine tuned models which are in GGUF format and run in with ollama locally:

```python
import subprocess
import os
import shutil

def run_ollama_gguf(model_path, model_name):
    """
    Runs a GGUF model locally with Ollama.

    Args:
        model_path (str): The path to the GGUF model file.
        model_name (str): The desired name for the model in Ollama.
    """

    # 1. Ensure Ollama is running
    try:
        subprocess.run(["ollama", "list"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("Ollama is running.")
    except subprocess.CalledProcessError:
        print("Ollama is not running. Please start Ollama.")
        return

    # 2. Check if the model exists in the correct directory.
    ollama_models_dir = os.path.expanduser("~/.ollama/models/blobs/")
    target_model_path = os.path.join(ollama_models_dir, os.path.basename(model_path))

    if not os.path.exists(model_path):
        print(f"Error: Model file not found at {model_path}")
        return

    # 3. Create a Modelfile (if needed)

    modelfile_content = f"""
    FROM {os.path.basename(model_path)}
    SYSTEM You are a helpful assistant.
    """
    modelfile_path = os.path.join(os.path.dirname(model_path), "Modelfile")

    with open(modelfile_path, "w") as f:
        f.write(modelfile_content)

    # 4. Move the model to the correct Ollama directory
    try:
        if not os.path.exists(target_model_path):
            shutil.copy(model_path, ollama_models_dir)
            print(f"Model file copied to {target_model_path}")
        else:
            print(f"Model file already exists in {target_model_path}")

    except Exception as e:
        print(f"Error moving model file: {e}")
        return

    # 5. Create the model in Ollama
    try:
        subprocess.run(["ollama", "create", model_name, "-f", modelfile_path], check=True)
        print(f"Model '{model_name}' created in Ollama.")
    except subprocess.CalledProcessError as e:
        print(f"Error creating model in Ollama: {e}")
        return

    # 6. Run the model
    try:
        while True: # loop to allow for multiple prompts.
            prompt = input("Enter your prompt (or type 'exit'): ")
            if prompt.lower() == 'exit':
                break
            result = subprocess.run(["ollama", "run", model_name, prompt], capture_output=True, text=True, check=True)
            print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error running model: {e}")
        return

if __name__ == "__main__":
    model_path = "train-model-python/Llama-3.2-1B-Instruct/model_1000/Llama-3.2-1B-Instruct-F16.gguf" #replace with your gguf file.
    model_name = "my_llama_py_1k"  # Replace with your desired model name
    run_ollama_gguf(model_path, model_name)
```



* **Check Ollama Status:** The script first verifies if Ollama is running by attempting to execute ollama list. If it fails, it prompts you to start Ollama.

* **Locate Ollama Model Directory:** It identifies the default directory where Ollama stores its model files (~/.ollama/models/blobs/).

* **Check for Existing Model:** It checks if a model file with the same name already exists in the Ollama model directory.

* **Create a Modelfile:** A Modelfile is a simple text file that tells Ollama how to load and run your model. This script dynamically creates a basic Modelfile in the same directory as your GGUF file. The crucial line FROM {os.path.basename(model_path)} points Ollama to your GGUF file. You can add more instructions to the Modelfile for system prompts, temperature settings, etc.

* **Move the GGUF File (if needed):** The script copies your GGUF model file into Ollama's designated blobs directory if it's not already there.

* **Create the Ollama Model:** It uses the ollama create command along with the generated Modelfile to register your GGUF model with Ollama under the specified model_name.

* **Run the Model Interactively:** Finally, it enters a loop that allows you to type prompts, which are then passed to your newly created Ollama model using ollama run. The model's responses are printed to your console. Type exit to end the interactive session.

## Getting Started: Running Your Local Model
Here's how you can use this script to run your GGUF model with Ollama:

**Install Ollama:** If you haven't already, download and install Ollama from https://ollama.ai/. Make sure it's running in the background.

**Obtain a GGUF Model:** You'll need a GGUF file of the Hugging Face model you want to run. You can either download one that's already in GGUF format (check repositories on Hugging Face) or convert a Hugging Face model to GGUF using tools like llama.cpp.

**Save the Python Script:** Save the provided Python code as a .py file (e.g., run_local_llm.py).

**Update the Script:**
```
model_path: Replace "python-scripts-ollama/train-model-python/Llama-3.2-1B-Instruct/model_1000/Llama-3.2-1B-Instruct-F16.gguf" #with the actual path to your GGUF file on your local machine.
model_name: Change "my_llama_py_1k" to your desired name for the model in Ollama (e.g., my-cool-llama, code-assistant).
```
**Run the Script:** Open your terminal or command prompt, navigate to the directory where you saved the script, and run it using:

```
python run_local_llm.py
```

**Interact with Your Model:** If everything goes well, the script will indicate that Ollama is running, copy the model (if needed), create the Ollama model, and then present you with a prompt:

```
ollama run my_llama_py_1k
```
Type your questions or instructions and press Enter. The model's response will be displayed. Continue prompting or type exit to finish.

## Beyond the Basics: Customizing Your Ollama Setup
The generated Modelfile in the script is very basic. You can enhance it by adding more instructions:

* **SYSTEM Prompt:** Modify the SYSTEM You are a helpful assistant. line to give your model a specific persona or instructions it should follow.
* **TEMPLATE:** For some models, you might need to define a specific prompt template to ensure proper formatting of your inputs.
* **PARAMETER:** You can set various inference parameters like temperature, top_k, top_p, etc., directly in the Modelfile.
For more details on Modelfile syntax and options, refer to the official Ollama documentation: https://ollama.ai/docs/modelfile

## Conclusion: Your Local LLM Playground
By converting Hugging Face models to GGUF and using Ollama, you unlock a fantastic way to experiment with and utilize powerful language models locally. This approach offers benefits like:

* **Privacy:** Your data and interactions remain on your machine.
* **Offline Access:** No internet connection is required to run the models once they are set up.
* **Cost-Effectiveness:** No recurring API fees.
* **Customization:** You have more control over the model and its configuration.

So, dive in, explore the vast landscape of Hugging Face models, and start building your own local LLM playground with GGUF and Ollama! This script provides a solid foundation for integrating your converted models into the Ollama ecosystem, making local LLM experimentation more accessible than ever.


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
