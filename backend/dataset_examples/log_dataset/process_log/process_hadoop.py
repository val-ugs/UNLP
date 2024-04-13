import pandas as pd
import os
import re

from enums import ClassificationLabel, NerLabel

def try_define_ner_label(nlp_token, column_string, ner_label_id, initial):
    if (nlp_token['token'] in column_string):
        nlp_token['nlp_token_ner_label'] = {
            'nlp_token': nlp_token['id'],
            'initial': initial,
            'ner_label': ner_label_id
        }

def find_ner_label_id(ner_labels, ner_label):
    for nl in ner_labels:
        if (nl['name'] == ner_label.value):
            return nl['id']
    
    return None

def define_nlp_token_ner_label(nlp_token, row, ner_labels, is_finished_ner_labels, total_added_tokens):
    if (is_finished_ner_labels[NerLabel.DateTime] == False):
        initial = row['Date'][0] == nlp_token['token'] and total_added_tokens == 1
        ner_label_id = find_ner_label_id(ner_labels, NerLabel.DateTime)
        try_define_ner_label(nlp_token, row['Date'], ner_label_id, initial)
        try_define_ner_label(nlp_token, row['Time'], ner_label_id, initial)
        if (total_added_tokens >= len(row['Date']) + len(row['Time']) - 1):
            is_finished_ner_labels[NerLabel.DateTime] = True

    elif (is_finished_ner_labels[NerLabel.Level] == False):
        initial = row['Level'][0] == nlp_token['token'] and total_added_tokens == len(row['Date']) + len(row['Time'])
        ner_label_id = find_ner_label_id(ner_labels, NerLabel.Level)
        try_define_ner_label(nlp_token, row['Level'], ner_label_id, initial)
        if (total_added_tokens >= len(row['Date']) + len(row['Time']) + len(row['Level']) - 1):
            is_finished_ner_labels[NerLabel.Level] = True

    elif (is_finished_ner_labels[NerLabel.Process] == False):
        initial = row['Process'][0] == nlp_token['token'] and total_added_tokens == len(row['Date']) + len(row['Time']) + len(row['Level'])
        ner_label_id = find_ner_label_id(ner_labels, NerLabel.Process)
        try_define_ner_label(nlp_token, row['Process'], ner_label_id, initial)
        if (total_added_tokens >= len(row['Date']) + len(row['Time']) + len(row['Level']) + len(row['Process']) - 1):
            is_finished_ner_labels[NerLabel.Process] = True

    elif (is_finished_ner_labels[NerLabel.Component] == False):
        initial = row['Component'][0] == nlp_token['token'] and total_added_tokens == len(row['Date']) + len(row['Time']) + len(row['Level']) + len(row['Process'])
        ner_label_id = find_ner_label_id(ner_labels, NerLabel.Component)
        try_define_ner_label(nlp_token, row['Component'], ner_label_id, initial)
        if (total_added_tokens >= len(row['Date']) + len(row['Time']) + len(row['Level']) + len(row['Process']) + len(row['Component']) - 1):
            is_finished_ner_labels[NerLabel.Component] = True

    elif (is_finished_ner_labels[NerLabel.Content] == False):
        initial = row['Content'][0] == nlp_token['token'] and total_added_tokens == len(row['Date']) + len(row['Time']) + len(row['Level']) + len(row['Process']) + len(row['Component'])
        ner_label_id = find_ner_label_id(ner_labels, NerLabel.Content)
        try_define_ner_label(nlp_token, row['Content'], ner_label_id, initial)
        if (total_added_tokens >= len(row['Date']) + len(row['Time']) + len(row['Level']) + len(row['Process']) + len(row['Component']) + len(row['Content']) - 1):
            is_finished_ner_labels[NerLabel.Content] = True

def tokenize(line, token_pattern_to_remove, token_pattern_to_split):
    line = re.sub(token_pattern_to_remove, '', line)
    line = re.split(token_pattern_to_split, line)
    line = list(filter(None, line)) # remove empty strings
    return line

def process_hadoop(token_pattern_to_remove, token_pattern_to_split, ner_labels):
    log_file_name = os.path.join(os.path.dirname(__file__), '../logs/Hadoop_2k.log')
    csv_file_name = os.path.join(os.path.dirname(__file__), '../logs/Hadoop_2k.log_structured.csv')

    with open(log_file_name) as f:
        lines = f.readlines()
    df = pd.read_csv(csv_file_name, encoding='utf-8')

    df = df.drop_duplicates(subset=['Content']) # remove duplicates by content

    df = df.applymap(lambda x: tokenize(x, token_pattern_to_remove, token_pattern_to_split) if isinstance(x, str) else x)

    nlp_texts = []
    for _, row in df.iterrows():
        lineId = row['LineId'] - 1
        line = tokenize(lines[lineId], token_pattern_to_remove, token_pattern_to_split)
        
        nlp_tokens = []

        is_finished_ner_labels = {
            NerLabel.DateTime: False,
            NerLabel.Level: False,
            NerLabel.Process: False,
            NerLabel.Component: False,
            NerLabel.Content: False
        }

        total_added_tokens = 0
        
        for token_index, token in enumerate(line):
            nlp_token = {
                'id': token_index + 1,
                'nlp_token_ner_label': None,
                "token": token,
                "pos": token_index,
            }
            
            define_nlp_token_ner_label(nlp_token, row, ner_labels, is_finished_ner_labels, total_added_tokens)

            nlp_tokens.append(nlp_token)

            total_added_tokens += 1

        nlp_texts.append({
            'nlp_tokens': nlp_tokens,
            'text': lines[lineId],
            'classification_label': ClassificationLabel.Hadoop.value,
            'summarization': None
        })

    return nlp_texts