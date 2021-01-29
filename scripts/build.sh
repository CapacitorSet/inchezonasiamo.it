dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"/../
alias npm-exec='PATH=$(npm bin):$PATH'
npm-exec pug $dir/*.pug