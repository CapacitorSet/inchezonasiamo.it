dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"/../
rsync -varzz $dir inchezonasiamo.it:caddy/inchezonasiamo.it/www --exclude=node_modules