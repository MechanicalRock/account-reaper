#!/bin/bash

unset AWS_CREDENTIAL_EXPIRATION
unset AWS_SESSION_TOKEN
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_REGION
unset AWS_PROFILE

echo "Type in your account id:"
read ACCOUNT_ID

echo "Type in your username:"
read USER_NAME

echo "Type in your 6 digit mfa code:"
read MFA_CODE

mfa_arn="arn:aws:iam::$ACCOUNT_ID:mfa/$USER_NAME"

credentials=$(aws sts get-session-token --serial-number $mfa_arn --token-code $MFA_CODE | jq '.Credentials')

function getCredential () {
    echo $credentials | jq -r $1
}

export AWS_PROFILE=default
export AWS_ACCESS_KEY_ID=$(getCredential '.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(getCredential '.SecretAccessKey')
export AWS_SESSION_TOKEN=$(getCredential '.SessionToken')
export AWS_CREDENTIAL_EXPIRATION=$(getCredential '.Expiration')
export AWS_REGION=ap-southeast-2

echo "\\nYour AWS enviornment variables are:\\n"

env | grep AWS