export ENVNAME=dev
export NAMESPACE=vm-sight

kubectl create ns $NAMESPACE-$ENVNAME

source $("$HOME/bin/trdl" use werf "1.2" "stable")

if [ "$ENVNAME" = "dev" ] || [ "$ENVNAME" = "kvm" ]; then
    kubectl create ns $NAMESPACE-$ENVNAME
    cat <<EOF | kubectl -n $NAMESPACE-$ENVNAME apply -f -
kind: Secret
apiVersion: v1
metadata:
  name: id-rsa-vcs
data:
  id_rsa: $(cat ~/.ssh/id_rsa | base64 -w0)
type: Opaque
EOF
fi

cd .. && 
  werf converge --env dev --dev \
  --values=.helm/values-dev.yaml \
  --repo registry.ingress.local/vm-sight
