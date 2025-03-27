---
title: Fine-Tuning Your Own LLM From Raw Data to Ollama Magic - PART I
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

## Fine-Tuning Your Own LLM: From Raw Data to Ollama Magic

In the age of AI, Large Language Models (LLMs) are becoming increasingly accessible. But what if you need a model tailored to your specific needs? Today, we'll walk through the process of fine-tuning an LLM using your own dataset, and then convert it into a format usable by Ollama, a tool that makes running LLMs locally a breeze.

### Why Fine-Tune?

Pre-trained LLMs are powerful, but they might lack the specific knowledge or style your application demands. Fine-tuning allows you to adapt these models to your unique requirements, whether it's generating code, writing creative content, or processing domain-specific information.

### Our Journey: From Data to Deployment

Let's dive into the steps we took to fine-tune a model using a script that handles everything from data preparation to model conversion.

#### Data Preparation: The Foundation

Our journey begins with a JSON file containing our dataset. We load this data, create a Hugging Face Dataset, and split it into training and testing sets. This ensures we can evaluate our model's performance after fine-tuning.


```
import json
from datasets import Dataset

with open('scraped_data-new.json', 'r') as f:
    data = json.load(f)

dataset = Dataset.from_list(data)
dataset = dataset.train_test_split(test_size=0.1)
train_dataset = dataset["train"]
test_dataset = dataset["test"]
```

#### Loading the Model and Tokenizer: Choosing Our Tools

We selected the unsloth/Llama-3.2-1B-Instruct model for its efficiency and performance. A tokenizer is essential for converting text into numerical tokens that the model can understand.


```
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "unsloth/Llama-3.2-1B-Instruct"
model = AutoModelForCausalLM.from_pretrained(model_name).to("mps") # or cuda if available
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token
```

#### Tokenizing the Dataset: Preparing for Training

The tokenizer converts our text data into a format the model can process. We define a tokenize_function to handle truncation and padding, ensuring all sequences have the same length.


```
def tokenize_function(examples, tokenizer):
    result = tokenizer(examples["content"], truncation=True, padding="max_length", max_length=512)
    result["labels"] = result["input_ids"].copy()
    return result

tokenized_train_dataset = train_dataset.map(lambda examples: tokenize_function(examples, tokenizer), batched=True)
tokenized_test_dataset = test_dataset.map(lambda examples: tokenize_function(examples, tokenizer), batched=True)
```

#### Setting Training Arguments: Defining the Learning Process

We configure the training process using TrainingArguments, specifying parameters like learning rate, batch size, and number of epochs. These settings control how the model learns from the data.


```
from transformers import TrainingArguments

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    optim="adamw_torch",
    # ... other arguments ...
)
```

#### Training the Model: The Heart of the Process

We use the Trainer class to fine-tune our model. This involves feeding the tokenized data to the model, calculating the loss, and updating the model's weights.


```
from transformers import Trainer

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_train_dataset,
    eval_dataset=tokenized_test_dataset,
)

trainer.train()
```

#### Saving the Model: Preserving Our Work

After training, we save the fine-tuned model and tokenizer. It is good practice to check if the pytorch_model.bin or model.safetensors were successfully created.


```
model.save_pretrained("./fine_tuned_model/model")
tokenizer.save_pretrained("./fine_tuned_model/model")
```

#### Converting to GGUF: Ollama Compatibility

To use our model with Ollama, we convert it to the GGUF format. This is a crucial step for running the model efficiently on your local machine.

```
python3 llama.cpp/convert_hf_to_gguf.py ./fine_tuned_model/model
```

#### Running with Ollama: Bringing It to Life

Now, you can use Ollama to run your fine-tuned model. Simply create a Modelfile and pull or create your model.

FROM ./fine_tuned_model/model/ggml-model-f16.gguf
Then run:


```
ollama create my_custom_model -f Modelfile
ollama run my_custom_model
```

### Conclusion

Fine-tuning LLMs is a powerful way to tailor these models to your specific needs. With the right tools and techniques, you can create custom models that perform exceptionally well in your domain. Ollama makes it easy to run these models locally, giving you full control over your AI applications.

### Next Steps
* Experiment with different datasets and model architectures.
* Explore advanced fine-tuning techniques like LoRA.
* Integrate your fine-tuned model into your applications.


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
