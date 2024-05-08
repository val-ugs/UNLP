import pandas as pd
import os
import re

from enums import ClassificationLabel, NerLabel

class LogNlpDatasetParser:
    def __init__(self, token_pattern_to_remove, token_pattern_to_split, ner_labels):
        self.token_pattern_to_remove = token_pattern_to_remove
        self.token_pattern_to_split = token_pattern_to_split
        self.ner_labels = ner_labels
        self.total_tokens_by_ner_label = 0

    def process(self):
        log_file_name, csv_file_name = self.init_log_and_csv_files()

        with open(log_file_name) as f:
            lines = f.readlines()
        df = pd.read_csv(csv_file_name, encoding='utf-8', dtype=str)

        df = df.drop_duplicates(subset=['Content']) # remove duplicates by content

        df = df.applymap(lambda x: self.__tokenize(x))
        
        nlp_texts = []
        for _, row in df.iterrows():
            lineId = int(row['LineId'][0]) - 1
            line = self.__tokenize(lines[lineId])
            
            nlp_tokens = []

            is_finished_ner_labels = {
                NerLabel.DateTime: False,
                NerLabel.Level: False,
                NerLabel.Process: False,
                NerLabel.User: False,
                NerLabel.Node: False,
                NerLabel.Component: False,
                NerLabel.Content: False,
                NerLabel.Other: False,
            }

            ner_label_rows = self.init_ner_label_rows(row)

            for token_index, token in enumerate(line):
                nlp_token = {
                    'id': token_index + 1,
                    'nlp_token_ner_label': None,
                    "token": token,
                    "pos": token_index,
                }
                
                self.__define_nlp_token_ner_label(nlp_token, ner_label_rows, is_finished_ner_labels)

                nlp_tokens.append(nlp_token)

            nlp_texts.append({
                'nlp_tokens': nlp_tokens,
                'text': lines[lineId],
                'classification_label': self.init_classification_label(),
                'summarization': None
            })

        return nlp_texts
    
    # override
    def init_log_and_csv_files(self):
        pass
        
        # Example:
        # log_file_name = os.path.join(os.path.dirname(__file__), '../logs/Hadoop_2k.log')
        # csv_file_name = os.path.join(os.path.dirname(__file__), '../logs/Hadoop_2k.log_structured.csv')
        # return log_file_name, csv_file_name
    
    # override
    def init_classification_label(self):
        pass
        
        # Example:
        # return ClassificationLabel.Hadoop.value

    # override
    def init_ner_label_rows(self, row):
        pass
        
        # Example (Sequence is important):
        # return {
        #     NerLabel.DateTime: [row['Date'], row['Time']],
        #     NerLabel.Level: [row['Level']],
        #     NerLabel.Process: [row['Process']],
        #     NerLabel.User: [],
        #     NerLabel.Node: [],
        #     NerLabel.Component: [row['Component']],
        #     NerLabel.Content: [row['Content']]
        # }
    
    def __define_nlp_token_ner_label(self, nlp_token, ner_label_rows, is_finished_ner_labels):
        # if (is_finished_ner_labels[NerLabel.DateTime] == False and len(ner_label_rows[NerLabel.DateTime]) > 0):
        #     self.__define_ner_label(nlp_token, ner_label_rows[NerLabel.DateTime], NerLabel.DateTime, is_finished_ner_labels)

        # elif (is_finished_ner_labels[NerLabel.Level] == False and len(ner_label_rows[NerLabel.Level]) > 0):
        #     self.__define_ner_label(nlp_token, ner_label_rows[NerLabel.Level], NerLabel.Level, is_finished_ner_labels)

        # elif (is_finished_ner_labels[NerLabel.Process] == False and len(ner_label_rows[NerLabel.Process]) > 0):
        #     self.__define_ner_label(nlp_token, ner_label_rows[NerLabel.Process], NerLabel.Process, is_finished_ner_labels)

        # elif (is_finished_ner_labels[NerLabel.User] == False and len(ner_label_rows[NerLabel.User]) > 0):
        #     self.__define_ner_label(nlp_token, ner_label_rows[NerLabel.User], NerLabel.User, is_finished_ner_labels)

        # elif (is_finished_ner_labels[NerLabel.Node] == False and len(ner_label_rows[NerLabel.Node]) > 0):
        #     self.__define_ner_label(nlp_token, ner_label_rows[NerLabel.Node], NerLabel.Node, is_finished_ner_labels)

        # elif (is_finished_ner_labels[NerLabel.Component] == False and len(ner_label_rows[NerLabel.Component]) > 0):
        #     self.__define_ner_label(nlp_token, ner_label_rows[NerLabel.Component], NerLabel.Component, is_finished_ner_labels)

        # elif (is_finished_ner_labels[NerLabel.Content] == False and len(ner_label_rows[NerLabel.Content]) > 0):
        #     self.__define_ner_label(nlp_token, ner_label_rows[NerLabel.Content], NerLabel.Content, is_finished_ner_labels)

        for index, (ner_label, row_data) in enumerate(ner_label_rows.items()):
            if (is_finished_ner_labels[ner_label] == False and len(row_data) > 0):
                self.__define_ner_label(nlp_token, row_data, ner_label, is_finished_ner_labels)
                return

    def __define_ner_label(self, nlp_token, row_data, ner_label, is_finished_ner_labels):
        initial = row_data[0][0] == nlp_token['token'] and self.total_tokens_by_ner_label == 0
        
        for data in row_data:
            if (nlp_token['token'] not in data):
                continue

            ner_label_id = self.__find_ner_label_id(ner_label)
            nlp_token['nlp_token_ner_label'] = {
                'nlp_token': nlp_token['id'],
                'initial': initial,
                'ner_label': ner_label_id
            }
            
            self.total_tokens_by_ner_label += 1

        if (nlp_token['nlp_token_ner_label'] == None):
            nlp_token['nlp_token_ner_label'] = {
                'nlp_token': nlp_token['id'],
                'initial': True,
                'ner_label': next(ner_label['id'] for ner_label in self.ner_labels if ner_label['name'] == NerLabel.Other.value)
            }

        if (self.total_tokens_by_ner_label >= sum(len(data) for data in row_data)):
            is_finished_ner_labels[ner_label] = True
            self.total_tokens_by_ner_label -= sum(len(data) for data in row_data)

    def __find_ner_label_id(self, ner_label):
        for nl in self.ner_labels:
            if (nl['name'] == ner_label.value):
                return nl['id']
        
        return None
    
    def __tokenize(self, line):
        line = str(line)
        line = re.sub(self.token_pattern_to_remove, '', line)
        line = re.split(self.token_pattern_to_split, line)
        line = list(filter(None, line)) # remove empty strings
        return line