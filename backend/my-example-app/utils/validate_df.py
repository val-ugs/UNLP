# move to api:
def validate_df(df):
    if 'text' not in df.columns:
        raise Exception('label \'text\' not in dataframe')
    
    if 'labels' not in df.columns:
        raise Exception('label \'labels\' not in dataframe')