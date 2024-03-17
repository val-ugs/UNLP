First, run env:
python -m venv env
source ./env/Scripts/activate
pip install -r requirements.txt (install cuda from the internet)

Save requirements:
pip freeze > requirements.txt

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