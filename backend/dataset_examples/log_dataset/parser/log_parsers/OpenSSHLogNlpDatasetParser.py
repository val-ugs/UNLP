import os
from parser.LogNlpDatasetParser import LogNlpDatasetParser
from enums import ClassificationLabel, NerLabel


class OpenSSHLogNlpDatasetParser(LogNlpDatasetParser):
    def init_log_and_csv_files(self):
        log_file_name = os.path.join(os.path.dirname(__file__), '../../logs/OpenSSH_2k.log')
        csv_file_name = os.path.join(os.path.dirname(__file__), '../../logs/OpenSSH_2k.log_structured.csv')
        return log_file_name, csv_file_name
    
    def init_classification_label(self):
        return ClassificationLabel.OpenSSH.value

    def init_ner_label_rows(self, row):
        return {
            NerLabel.DateTime: [row['Date'], row['Day'], row['Time']],
            NerLabel.Level: [],
            NerLabel.User: [],
            NerLabel.Node: [],
            NerLabel.Component: [row['Component']],
            NerLabel.Process: [row['Pid']],
            NerLabel.Content: [row['Content']]
        }