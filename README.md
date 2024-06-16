# UNLP

Universal NLP constructor - a natural language processing constructor using artificial intelligence (hereinafter referred to as the Constructor) is a visual programming software designed for solving complex problems consisting of subtasks.

## Program sections

1. Section "Prepare dataset".
![alt text](https://github.com/val-ugs/UDevMe.Cryptography/blob/prod-v1/images/PrepareDataset.png?raw=true)
<p align="center">
  <b>Prepare dataset</b><br>
</p>

In this section the user has access to a menu containing the following options:
1.1. "Load data" - file loading with txt expansion containing text data, or file loading with json expansion in which data is presented in a special format («NLP Records»).
1.2. "Save data" - creation of a file with json expansion, in which data is presented in a special format («NLP Records»).
1.3. "Actions" includes in itself a number of data processing operations, such as copying data sets, cleaning fields and concentrations in the "NLP Records" presented for work with algorithms of processing of natural language and etc.
1.4. "Metrics" consists of metrics that allow you to calculate two sets of data, standard and successful in working out the algorithm of the machine learning.

2. Section "NLP".
2.1 Subsection "Train".
![alt text](https://github.com/val-ugs/UDevMe.Cryptography/blob/prod-v1/images/Traib.png?raw=true)
<p align="center">
  <b>Training</b><br>
</p>

In this subsection, the choice of models, their setup and training on basic training and valuable datasets.

2.2 Subsection "Predict".
![alt text](https://github.com/val-ugs/UDevMe.Cryptography/blob/prod-v1/images/Predict.png?raw=true)
<p align="center">
  <b>Predicting</b><br>
</p>

In this subsection, the model is selected and the test dataset is predicted.

3. Section "NLP Constructor"
![alt text](https://github.com/val-ugs/UDevMe.Cryptography/blob/prod-v1/images/Constructor.png?raw=true)
<p align="center">
  <b>Constructor</b><br>
</p>

This section includes the design of complex natural language processing processes and the formation of chains of sequential and parallel operations

In this project, models from the Transformers library developed by Hugging Face are used.