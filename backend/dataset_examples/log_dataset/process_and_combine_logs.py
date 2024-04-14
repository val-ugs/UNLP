import random
from os.path import abspath, dirname, join
import json

from enums import NerLabel

from parser.log_parsers.ApacheLogNlpDatasetParser import ApacheLogNlpDatasetParser
from parser.log_parsers.HadoopLogNlpDatasetParser import HadoopLogNlpDatasetParser
from parser.log_parsers.HDFSLogNlpDatasetParser import HDFSLogNlpDatasetParser
from parser.log_parsers.LinuxLogNlpDatasetParser import LinuxLogNlpDatasetParser
from parser.log_parsers.MacLogNlpDatasetParser import MacLogNlpDatasetParser
from parser.log_parsers.OpenSSHLogNlpDatasetParser import OpenSSHLogNlpDatasetParser
from parser.log_parsers.ProxifierLogNlpDatasetParser import ProxifierLogNlpDatasetParser
from parser.log_parsers.SparkLogNlpDatasetParser import SparkLogNlpDatasetParser
from parser.log_parsers.WindowsLogNlpDatasetParser import WindowsLogNlpDatasetParser
from parser.log_parsers.ZookeeperLogNlpDatasetParser import ZookeeperLogNlpDatasetParser

log_directory_path = './logs'

def convert_to_my_dataset():
    ner_labels = []
    for index, ner_label in enumerate(NerLabel):
        r = lambda: random.randint(0,255)
        color ='#%02X%02X%02X' % (r(),r(),r())
        ner_labels.append({
            'id': index + 1,
            'name': ner_label.value,
            'color': color
        })

    print(ner_labels)

    token_pattern_to_remove = ''
    token_pattern_to_split = '[\\s,\\[,\\],\\@,\\:,\\-,\\=, \\\, \\/]'

    nlp_texts = []

    apache_log_nlp_dataset_parser = ApacheLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    nlp_texts.extend(apache_log_nlp_dataset_parser.process()[0:200])

    hadoop_log_nlp_dataset_parser = HadoopLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    nlp_texts.extend(hadoop_log_nlp_dataset_parser.process()[0:200])

    hdfs_log_nlp_dataset_parser = HDFSLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    nlp_texts.extend(hdfs_log_nlp_dataset_parser.process()[0:200])

    linux_log_nlp_dataset_parser = LinuxLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    nlp_texts.extend(linux_log_nlp_dataset_parser.process()[0:200])

    mac_log_nlp_dataset_parser = MacLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    nlp_texts.extend(mac_log_nlp_dataset_parser.process()[0:200])

    open_ssh_log_nlp_dataset_parser = OpenSSHLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    nlp_texts.extend(open_ssh_log_nlp_dataset_parser.process()[0:200])

    proxifier_log_nlp_dataset_parser = ProxifierLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    nlp_texts.extend(proxifier_log_nlp_dataset_parser.process()[0:200])

    spark_log_nlp_dataset_parser = SparkLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    nlp_texts.extend(spark_log_nlp_dataset_parser.process()[0:200])

    windows_log_nlp_dataset_parser = WindowsLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    nlp_texts.extend(windows_log_nlp_dataset_parser.process()[0:200])

    zookeeper_log_nlp_dataset_parser = ZookeeperLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    nlp_texts.extend(zookeeper_log_nlp_dataset_parser.process()[0:200])

    print(len(nlp_texts))

    json_data = {
        'nlp_texts': nlp_texts,
        'ner_labels': ner_labels,
        'token_pattern_to_remove': token_pattern_to_remove,
        'token_pattern_to_split': token_pattern_to_split
    }

    json_file_path = join(dirname(abspath(__file__)), "my_log_dataset.json")
    with open(json_file_path, 'w') as f:
        json.dump(json_data, f)
    

convert_to_my_dataset()