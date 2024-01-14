import numpy as np
import pandas as pd
from models.DataType import DataType


def get_ner_corpus_dataset(dataType: DataType):
    # train - 60%, val - 20%, test 20%
    filename = f'datasets/NER/ner_corpus_dataset/ner.csv'
    df = pd.read_csv(filename, encoding='unicode_escape')

    del df['Sentence #']
    del df['POS']
    
    df['Sentence'] = df['Sentence'].apply(lambda x: x.split())
    df['Tag'] = df['Tag'].apply(lambda x: x.replace('[','').replace(']','').replace('\'','').replace(' ', '').split(','))

    for index, row in df.iterrows():
        if (len(row['Sentence']) != len(row['Tag'])):
            raise Exception(f'Length of the tag array and the sentence word array are not equal. Row index: {index}')

    df = df.rename(columns={"Sentence": "tokens", "Tag": "tags"})

    train_df, val_df, test_df = np.split(df, [int(.6 * len(df)), int(.8 * len(df))])

    if dataType == dataType.Train:
        return train_df
    elif dataType == dataType.Test:
        return val_df
    
    return test_df