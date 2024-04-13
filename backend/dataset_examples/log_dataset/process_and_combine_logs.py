import random
from os.path import abspath, dirname, join
import json

from enums import NerLabel
from process_log.process_apache import process_apache
from process_log.process_hadoop import process_hadoop

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

    token_pattern_to_remove = '[\\[\\]:]'
    token_pattern_to_split = '\\s'

    nlp_texts = []
    nlp_texts.extend(process_apache(token_pattern_to_remove, token_pattern_to_split, ner_labels))
    nlp_texts.extend(process_hadoop(token_pattern_to_remove, token_pattern_to_split, ner_labels))
    
    # process_apache(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    # process_hadoop(token_pattern_to_remove, token_pattern_to_split, ner_labels)
    
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