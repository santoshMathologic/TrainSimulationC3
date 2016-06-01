echo "This runs on Local side:"
echo $JAVA_HOME

APP_NAME=`echo "${PWD##*/}"`

echo "Zipping the project files into $APP_NAME.zip"
zip -q -r $APP_NAME.zip . -x \.git\* \*.zip \utils\*

read -p "Please to EXIT deploy-local.sh " DONE