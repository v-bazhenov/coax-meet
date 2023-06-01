#!/usr/bin/env bash

LAYER_NAME=$1 # input layer, retrived as arg
ZIP_ARTIFACT=${LAYER_NAME}.zip
LAYER_BUILD_DIR="python"

# note: put the libraries in a folder supported by the runtime, means that should by python

rm -rf ${LAYER_BUILD_DIR} && mkdir -p ${LAYER_BUILD_DIR}

docker run --rm -v `pwd`:/var/task:z lambci/lambda:build-python3.10 python3.10 -m pip --isolated install -t ${LAYER_BUILD_DIR} -r requirements.txt

zip -r ${ZIP_ARTIFACT} .

echo "Publishing layer to AWS..."
aws lambda publish-layer-version --layer-name ${LAYER_NAME} --zip-file fileb://${ZIP_ARTIFACT} --compatible-runtimes python3.10 --profile arn:aws:iam::773229839915:user/coax-meet

# clean up
rm -rf ${LAYER_BUILD_DIR}
rm -r ${ZIP_ARTIFACT}
