def get_id2label_label2id(labels):
    id2label = {}
    label2id = {}
    for id, label in enumerate(sorted(set(labels))):
        id2label[id] = label
        label2id[label] = id
    return id2label, label2id