
from apps.nlp.utils.get_id2label_label2id import get_id2label_label2id
from pandas.api.types import is_numeric_dtype
import datasets

class ClassificationPreparer:
    def __init__(self, tokenizer):
        self.tokenizer = tokenizer

    def get_dataset(self, df):
        new_df = df.copy()
        if 'labels' in df.columns:
            new_df['labels'] = self.__convert_to_label_int(new_df['labels'])
        dataset = datasets.Dataset.from_pandas(new_df)
        tokenized_dataset = dataset.map(self.__preprocess_function, batched=True)

        return tokenized_dataset
    
    def __preprocess_function(self, examples):
        return self.tokenizer(examples["text"], truncation=True)
    
    def __convert_to_label_int(self, df_labels):
        if (is_numeric_dtype(df_labels) == False):
            _, label2id = get_id2label_label2id(df_labels.tolist())
        df_labels = df_labels.apply(lambda x: label2id[x])
        return df_labels