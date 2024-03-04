import pandas as pd
from apps.common.models import NlpText, NlpToken, NlpTokenNerLabel


def convert_nlp_dataset_to_df(nlp_dataset):
    nlp_texts = NlpText.objects.filter(nlp_dataset=nlp_dataset)
    data = []
    for nlp_text in nlp_texts:
        nlp_tokens = NlpToken.objects.filter(nlp_text=nlp_text)
        ner_tags = []
        for nlp_token in nlp_tokens:
            try:
                nlp_token_ner_label = NlpTokenNerLabel.objects.get(nlp_token=nlp_token)
            except NlpTokenNerLabel.DoesNotExist:
                nlp_token_ner_label = None
            if nlp_token_ner_label and nlp_token_ner_label.ner_label:
                ner_tags.append(f"{'B-' if nlp_token_ner_label.initial == True else 'I-'}{nlp_token_ner_label.ner_label.name}")
            else:
                ner_tags.append("O")
        
        data.append([nlp_text.id, nlp_text.text, nlp_text.classification_label, nlp_text.summarization, [nlp_token.id for nlp_token in nlp_tokens], [nlp_token.token for nlp_token in nlp_tokens], ner_tags])
    df = pd.DataFrame(data, columns=['id', 'text', 'labels', 'summary', 'tokens_ids', 'tokens', 'tags'])
    return df