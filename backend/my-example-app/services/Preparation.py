
from utils.get_id2label_label2id import get_id2label_label2id
from pandas.api.types import is_numeric_dtype
import datasets

class Preparation:
    def __init__(self, tokenizer):
        self.tokenizer = tokenizer

    def get_classification_dataset(self, df):
        new_df = df.copy()
        if 'labels' in df.columns:
            new_df['labels'] = self.__convert_to_label_int(new_df['labels'])
        dataset = datasets.Dataset.from_pandas(new_df)
        tokenized_dataset = dataset.map(self.__preprocess_classification_function, batched=True)

        return tokenized_dataset
    
    def __classification_preprocess_function(self, examples):
        return self.tokenizer(examples["text"], truncation=True)
    
    def __classification_convert_to_label_int(self, df_labels):
        if (is_numeric_dtype(df_labels) == False):
            _, label2id = get_id2label_label2id(df_labels.tolist())
        df_labels = df_labels.apply(lambda x: label2id[x])
        return df_labels
    
    def get_ner_dataset(self, df):
        new_df = df.copy()
        if 'tags' in df.columns:
            new_df['tags'] = self.__ner_convert_to_label_int(new_df['tags'])
        dataset = datasets.Dataset.from_pandas(new_df)
        tokenized_dataset = dataset.map(self.__preprocess_ner_function, batched=True)

        return tokenized_dataset
        
    def __preprocess_ner_function(self, examples):
        tokenized_inputs = self.tokenizer(examples['tokens'], truncation=True, is_split_into_words=True)

        labels = []
        for i, label in enumerate(examples['tags']):
            word_ids = tokenized_inputs.word_ids(batch_index=i)  # Map tokens to their respective word.
            previous_word_idx = None
            label_ids = []
            for word_idx in word_ids:  # Set the special tokens to -100.
                if word_idx is None:
                    label_ids.append(-100)
                elif word_idx != previous_word_idx:  # Only label the first token of a given word.
                    label_ids.append(label[word_idx])
                else:
                    label_ids.append(-100)
                previous_word_idx = word_idx
            labels.append(label_ids)

        tokenized_inputs["labels"] = labels
        return tokenized_inputs
    
    def __ner_convert_to_label_int(self, df_tags):
        list_of_tags = [tag for tag_list in df_tags.tolist() for tag in tag_list]
        if (all(is_numeric_dtype(tag) == False for tag in list_of_tags)):
            _, label2id = get_id2label_label2id(list_of_tags)
        df_tags = df_tags.apply(lambda df_tags_list: [label2id[tag] for tag in df_tags_list])
        return df_tags