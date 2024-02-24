def split_df(df, proportion):
    prop_len_df = int(len(df) * proportion)
    return df.head(prop_len_df), df.tail(len(df) - prop_len_df)