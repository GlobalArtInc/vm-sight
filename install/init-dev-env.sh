set -e

DIR=/workspace
cd $DIR
mkdir -p /workspace

if ! [ -d $DIR/vm-sight ]; then
    echo "Clone repository"
    git clone git@github.com:GlobalArtInc/vm-sight.git
    cd $DIR/vm-sight
fi


if ! [ -f $DIR/.npm_i_app ]; then
    echo "Installing Dependencies"
    cd $DIR/vm-sight/app && pnpm i && \
    touch $DIR/.npm_i_app
fi
