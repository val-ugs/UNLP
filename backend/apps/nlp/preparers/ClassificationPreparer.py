
from apps.nlp.utils.get_id2label_label2id import get_id2label_label2id
from pandas.api.types import is_numeric_dtype
import datasets

class ClassificationPreparer:
    def __init__(self, tokenizer, label2id = None):
        self.tokenizer = tokenizer
        self.label2id = label2id

    def get_dataset(self, df):
        new_df = df.copy()
        new_df = new_df.loc[:, ['text', 'labels']] # take required fields
        if new_df['labels'].any():
            new_df['labels'] = self.__convert_to_label_int(new_df['labels'])
        else:
            new_df.pop('labels')
        dataset = datasets.Dataset.from_pandas(new_df)
        tokenized_dataset = dataset.map(self.__preprocess_function, batched=True)
    
        return tokenized_dataset
    
    def __preprocess_function(self, examples):
        return self.tokenizer(examples["text"], truncation=True)
    
    def __convert_to_label_int(self, df_labels):
        df_labels = df_labels.apply(lambda x: self.label2id[x])
        return df_labels