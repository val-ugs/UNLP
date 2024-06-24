# UNLP

<b>Universal NLP Constructor</b> is a visual programming software designed for solving complex natural language processing (NLP) problems that consist of subtasks. It leverages artificial intelligence (AI) techniques to effectively tackle these challenges.

## Program sections

### 1. Section "Prepare dataset"
![alt text](https://github.com/val-ugs/UNLP/blob/prod-v1/images/PrepareDataset.png?raw=true)
<p align="center">
  <b>Prepare dataset</b><br>
</p>

<p>
  In this section the user has access to a menu containing the following options:
  <ol>
    <li>
      "Load data" - file loading with txt expansion containing text data, or file loading with json expansion in which data is presented in a special format («NLP Records»).
    </li>
    <li>
      "Save data" - creation of a file with json expansion, in which data is presented in a special format («NLP Records»).
    </li>
    <li>
      "Actions" includes in itself a number of data processing operations, such as copying data sets, cleaning fields and concentrations in the "NLP Records" presented for work with algorithms of processing of natural language and etc.
    </li>
    <li>
      "Metrics" consists of metrics that allow you to calculate two sets of data, standard and successful in working out the algorithm of the machine learning.
    </li>
  </ol>
</p>

### 2. Section "NLP"
#### 2.1 Subsection "Train"
![alt text](https://github.com/val-ugs/UNLP/blob/prod-v1/images/Train.png?raw=true)
<p align="center">
  <b>Train</b><br>
</p>

<p>
  In this subsection, the choice of models, their setup and training on basic training and valuable datasets.
</p>

#### 2.2 Subsection "Predict"
![alt text](https://github.com/val-ugs/UNLP/blob/prod-v1/images/Predict.png?raw=true)
<p align="center">
  <b>Predict</b><br>
</p>

<p>
  In this subsection, the model is selected and the test dataset is predicted.
</p>

### 3. Section "NLP Constructor"
![alt text](https://github.com/val-ugs/UNLP/blob/prod-v1/images/Constructor.png?raw=true)
<p align="center">
  <b>Constructor</b><br>
</p>

This section includes the design of complex natural language processing processes and the formation of chains of sequential and parallel operations

In this project, models from the Transformers library developed by Hugging Face are used.
