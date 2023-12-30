import pandas as pd
from models.DataType import DataType


def get_emotions_dataset(dataType: DataType):
    filename = f'datasets/classification/emotions_dataset/{dataType.value}.txt'
    data = []

    with open(filename) as f:
        lines = f.read().splitlines() 
        for line in lines:
            data.append(line.split(';'))
    
    df = pd.DataFrame(data, columns=['text','labels'])
    
    return df