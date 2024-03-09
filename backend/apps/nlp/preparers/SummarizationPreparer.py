import datasets

prefix = "summarize: "

class SummarizationPreparer:
    def __init__(self, tokenizer):
        self.tokenizer = tokenizer

    def get_dataset(self, df):
        new_df = df.copy()
        new_df = df.loc[:, ['text', 'summary']] # take required fields
        dataset = datasets.Dataset.from_pandas(new_df)
        tokenized_dataset = dataset.map(self.__preprocess_function, batched=True)

        return tokenized_dataset
    
    def __preprocess_function(self, examples):
        inputs = [prefix + doc for doc in examples['text']]
        model_inputs = self.tokenizer(inputs, max_length=1024, truncation=True)
        if any(examples['summary']):
            labels = self.tokenizer(text_target=examples['summary'], max_length=128, truncation=True)
            model_inputs['labels'] = labels['input_ids']
        
        return model_inputs