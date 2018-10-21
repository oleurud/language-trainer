#!/bin/bash

NAME='language_trainer'
USER='_user'

if [ -n "$1" ]; then
    NAME=$1
fi

cleanDb() {
    psql -c "DROP DATABASE $NAME;"
    psql -c "DROP OWNED BY $NAME$USER;"
    psql -c "DROP ROLE $NAME$USER;"
}

cleanDb
