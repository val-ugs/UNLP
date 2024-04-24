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

    apache_log_nlp_dataset_parser = ApacheLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    apache_nlp_texts = apache_log_nlp_dataset_parser.process()

    hadoop_log_nlp_dataset_parser = HadoopLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    hadoop_nlp_texts = hadoop_log_nlp_dataset_parser.process()

    hdfs_log_nlp_dataset_parser = HDFSLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    hdfs_nlp_texts = hdfs_log_nlp_dataset_parser.process()

    linux_log_nlp_dataset_parser = LinuxLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    linux_nlp_texts = linux_log_nlp_dataset_parser.process()

    mac_log_nlp_dataset_parser = MacLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    mac_nlp_texts = mac_log_nlp_dataset_parser.process()

    open_ssh_log_nlp_dataset_parser = OpenSSHLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    open_ssh_nlp_texts = open_ssh_log_nlp_dataset_parser.process()

    proxifier_log_nlp_dataset_parser = ProxifierLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    proxifier_nlp_texts = proxifier_log_nlp_dataset_parser.process()

    spark_log_nlp_dataset_parser = SparkLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    spark_nlp_texts = spark_log_nlp_dataset_parser.process()

    windows_log_nlp_dataset_parser = WindowsLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    windows_nlp_texts = windows_log_nlp_dataset_parser.process()

    zookeeper_log_nlp_dataset_parser = ZookeeperLogNlpDatasetParser(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    zookeeper_nlp_texts = zookeeper_log_nlp_dataset_parser.process()

    
    train_nlp_texts = []
    train_nlp_texts.extend(apache_nlp_texts[0:200])
    train_nlp_texts.extend(hadoop_nlp_texts[0:200])
    train_nlp_texts.extend(hdfs_nlp_texts[0:200])
    train_nlp_texts.extend(linux_nlp_texts[0:200])
    train_nlp_texts.extend(mac_nlp_texts[0:200])
    train_nlp_texts.extend(open_ssh_nlp_texts[0:200])
    train_nlp_texts.extend(proxifier_nlp_texts[0:200])
    # train_nlp_texts.extend(spark_nlp_texts[0:200])
    train_nlp_texts.extend(windows_nlp_texts[0:200])
    train_nlp_texts.extend(zookeeper_nlp_texts[0:200])

    print(len(train_nlp_texts))
    random.shuffle(train_nlp_texts)

    train_json_data = {
        'nlp_texts': train_nlp_texts,
        'ner_labels': ner_labels,
        'token_pattern_to_remove': token_pattern_to_remove,
        'token_pattern_to_split': token_pattern_to_split
    }

    train_json_file_path = join(dirname(abspath(__file__)), "my_train_log_dataset.json")
    with open(train_json_file_path, 'w') as f:
        json.dump(train_json_data, f)

    valid_nlp_texts = []
    valid_nlp_texts.extend(apache_nlp_texts[200:240])
    valid_nlp_texts.extend(hadoop_nlp_texts[200:240])
    valid_nlp_texts.extend(hdfs_nlp_texts[200:240])
    valid_nlp_texts.extend(linux_nlp_texts[200:240])
    valid_nlp_texts.extend(mac_nlp_texts[200:240])
    valid_nlp_texts.extend(open_ssh_nlp_texts[200:240])
    valid_nlp_texts.extend(proxifier_nlp_texts[200:240])
    valid_nlp_texts.extend(spark_nlp_texts[200:240])
    valid_nlp_texts.extend(windows_nlp_texts[200:240])
    valid_nlp_texts.extend(zookeeper_nlp_texts[200:240])

    print(len(valid_nlp_texts))
    random.shuffle(valid_nlp_texts)

    valid_json_data = {
        'nlp_texts': valid_nlp_texts,
        'ner_labels': ner_labels,
        'token_pattern_to_remove': token_pattern_to_remove,
        'token_pattern_to_split': token_pattern_to_split
    }

    valid_json_file_path = join(dirname(abspath(__file__)), "my_valid_log_dataset.json")
    with open(valid_json_file_path, 'w') as f:
        json.dump(valid_json_data, f)

    test_nlp_texts = []
    test_nlp_texts.extend(apache_nlp_texts[240:280])
    test_nlp_texts.extend(hadoop_nlp_texts[240:280])
    test_nlp_texts.extend(hdfs_nlp_texts[240:280])
    test_nlp_texts.extend(linux_nlp_texts[240:280])
    test_nlp_texts.extend(mac_nlp_texts[240:280])
    test_nlp_texts.extend(open_ssh_nlp_texts[240:280])
    test_nlp_texts.extend(proxifier_nlp_texts[240:280])
    test_nlp_texts.extend(spark_nlp_texts[240:280])
    test_nlp_texts.extend(windows_nlp_texts[240:280])
    test_nlp_texts.extend(zookeeper_nlp_texts[240:280])

    print(len(test_nlp_texts))
    random.shuffle(test_nlp_texts)

    test_json_data = {
        'nlp_texts': test_nlp_texts,
        'ner_labels': ner_labels,
        'token_pattern_to_remove': token_pattern_to_remove,
        'token_pattern_to_split': token_pattern_to_split
    }

    test_json_file_path = join(dirname(abspath(__file__)), "my_test_log_dataset.json")
    with open(test_json_file_path, 'w') as f:
        json.dump(test_json_data, f)
    

convert_to_my_dataset()