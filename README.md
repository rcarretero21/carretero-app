Deploy in local:
    1- Deploy reverse proxy:
        2.1- Go to ./reverse-proxy folder and deploy proxy
            > cd ./reverse-proxy
            > docker-compose up -d 
    2- Go to carretero-app and install dependencies:
        > cd ./carretero-app
        > npm i
    3- Launch app in port 3000:
        > cd ./carretero-app
        > npm start 

Deploy in docker:
    1- Deploy reverse proxy:
        2.1- Go to ./reverse-proxy folder and deploy proxy
            > cd ./reverse-proxy
            > docker-compose up -d 
    2- Go to carretero-app and build app docker image:
        > cd ./carretero-app
        > docker build -t carretero-app:dev
    3- Deploy app:
        > cd ./carretero-app
        > docker-compose up -d

*Note: App port is react app default port 3000
