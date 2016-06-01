echo "This runs on remote side:"

APP_NAME_DEFAULT="APP_NAME"
APP_NAME=${1:-$APP_NAME_DEFAULT} 

DEPLOY_TYPE_DEFAULT="stage1"
DEPLOY_TYPE=${2:-$DEPLOY_TYPE_DEFAULT}

PORT_DEFAULT="PORT"
PORT=${3:-$PORT_DEFAULT}

APP_DIR_DEFAULT="APP_DIR"
APP_DIR=${4:-$APP_DIR_DEFAULT} 

APP_BIN_DEFAULT="RUN_BINARY"
APP_BIN=${5:-$APP_BIN_DEFAULT}

if [ "$APP_BIN" = "npm" ]; then
    APP_BIN=`which npm`
fi 

APP_ARGS_DEFAULT="RUN_ARGS"
APP_ARGS=${6:-$APP_ARGS_DEFAULT}

USER_NAME_DEFAULT=$USER
USER_NAME=${7:-$USER_NAME_DEFAULT}

GROUP_NAME_DEFAULT=`id -Gn $USER`
GROUP_NAME=${8:-$GROUP_NAME_DEFAULT}

PATH_LIST_DEFAULT=$PATH
PATH_LIST=${9:-$PATH_LIST_DEFAULT} 

SERVICE_NAME="$APP_NAME-$DEPLOY_TYPE"

service $SERVICE_NAME stop || true


# Unzip with overwrite true
unzip -q -o *.zip

npm install

echo "Generating utils/$APP_NAME.sh service file"

sed -e "s|$APP_NAME_DEFAULT|$SERVICE_NAME|g" -e "s|$APP_DIR_DEFAULT|$APP_DIR|g" -e "s|$APP_BIN_DEFAULT|$APP_BIN|g" -e "s|$APP_ARGS_DEFAULT|$APP_ARGS|g" -e "s|USER_NAME|$USER_NAME|g" -e "s|GROUP_NAME|$GROUP_NAME|g" -e "s|PATH_LIST|$PATH_LIST|g" utils/sample_service.sh > utils/$SERVICE_NAME

sudo service $SERVICE_NAME stop || true

cp -rf utils/$SERVICE_NAME /etc/init.d/
sudo chmod 775 /etc/init.d/$SERVICE_NAME

sudo update-rc.d $SERVICE_NAME defaults
sudo systemctl daemon-reload
sudo service $SERVICE_NAME start
