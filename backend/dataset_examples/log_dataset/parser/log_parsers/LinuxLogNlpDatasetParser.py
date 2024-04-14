import os
from parser.LogNlpDatasetParser import LogNlpDatasetParser
from enums import ClassificationLabel, NerLabel


class LinuxLogNlpDatasetParser(LogNlpDatasetParser):
    def init_log_and_csv_files(self):
        log_file_name = os.path.join(os.path.dirname(__file__), '../../logs/Linux_2k.log')
        csv_file_name = os.path.join(os.path.dirname(__file__), '../../logs/Linux_2k.log_structured.csv')
        return log_file_name, csv_file_name
    
    def init_classification_label(self):
        return ClassificationLabel.Linux.value

    def init_ner_label_rows(self, row):
        return {
            NerLabel.DateTime: [row['Month'], row['Date'], row['Time']],
            NerLabel.Level: [row['Level']],
            NerLabel.User: [],
            NerLabel.Node: [],
            NerLabel.Component: [row['Component']],
            NerLabel.Process: [row['PID']],
            NerLabel.Content: [row['Content']]
        }