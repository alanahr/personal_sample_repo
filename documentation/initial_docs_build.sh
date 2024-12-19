#!/bin/bash

set -e

d=`date +%m-%d-%Y`

RED='\033[0;31m'
CYAN='\033[0;36m'
ORANGE='\033[1;33m'
LT_GREEN='\033[1;32m'
NC='\033[0m' # No Color

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
HOME_DIR=`dirname $SCRIPT_DIR`
LOG_DIR="${SCRIPT_DIR}"
PY_LIB="python3.10"
PIP_LIB="pip3.10"

## not used
function check_cmd {
  command -v "${1}"
  if ! eval "command -v ${1}" ; then
    echo "${RED}ERROR: ${NC} Didn't find cmd or program or library: ${1}"
    return 1
  else
    return 0
  fi
}

## used
function echo_command {
    echo "  ${LT_GREEN} ${1} ${NC}"
}

function echo_info {
    echo "${CYAN}INFO: ${NC} ${1}"
}

function echo_error {
    echo "${RED}ERROR: ${NC} ${1}"
}

function echo_warning {
    echo "${ORANGE}WARNING: ${NC} ${1}"
}
######

echo_info "Step 1: checking for python"
if ! command -v $PY_LIB &> /dev/null
then
    echo_error " could not be found"
    exit 1
fi


echo_info "Step 2: checking for existing venv and creating"
echo $VIRTUAL_ENV
if [[ $VIRTUAL_ENV != "" ]]; then
  echo_error "Existing virtual environment in this instance found"
  exit 1;
fi
if [ -d "${SCRIPT_DIR}/.venv" ]; then
  echo_warning ".venv exists already. "
  read -p "Enter y to delete it and continue, any other key to exit " yn
  case $yn in
      [Yy]* ) rm -r "${SCRIPT_DIR}/.venv";;
      * ) exit 1;;
  esac
fi
echo_info "This will create a folder named .venv. To list this hidden folder, run: "
echo_command "ls -a"
cd "${SCRIPT_DIR}" && "${PY_LIB}" -m venv "${SCRIPT_DIR}/.venv"
cd "${SCRIPT_DIR}" && source "${SCRIPT_DIR}/.venv/bin/activate"
echo "Steps for venv usage:"
echo_command "source .venv/bin/activate"
echo "  To exit:"
echo_command "deactivate"


echo_info "Step 3: upgrading pip, wheel, etc.; logging output here and to a pip log"
"${VIRTUAL_ENV}/bin/${PIP_LIB}" -v install --upgrade pip pip-tools wheel 2>&1 | tee -a  "${LOG_DIR}/pipinstall_${d}.log"
#if [ $? -eq 0 ]; then
#  echo "pip upgrade exited successfully"
#fi

echo_info "Step 4: Installing pip requirements for sphinx"
#"${VIRTUAL_ENV}/bin/pip3.9" -v install -r "${SCRIPT_DIR}/requirements.txt" 2>&1 | tee -a  "${LOG_DIR}/pipinstall_${d}.log"
"${VIRTUAL_ENV}/bin/${PIP_LIB}" -v install sphinx nbsphinx
#if [ $? -eq 0 ]; then
#  echo "pip install ok"
#fi
echo_info "The currently installed pip packages are: "
"${VIRTUAL_ENV}/bin/${PIP_LIB}" list > "${LOG_DIR}/piplist.log"

echo_info "Step 5: Get started and use the virtual environment"
echo "To get started with sphinx, activate the virtual environment..."
echo_command "source .venv/bin/activate"

echo "and then enter..."
echo_command "sphinx-quickstart docs "

echo "To build the quickstart docs, enter... "
echo_command "sphinx-build -M html docs/source/ docs/build/"

