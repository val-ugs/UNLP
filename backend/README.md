First, run env:
source ./env/Scripts/activate

Run command to migrate models:
./manage.py makemigrations
./manage.py migrate

Run commands to loaddata:
./manage.py loaddata ./db_setup/classification_model_names.json
./manage.py loaddata ./db_setup/ner_model_names.json

Run server:
./manage.py runserver

Test Nlp:
./manage.py test apps/nlp/

Save requirements:
pip freeze > requirements.txt