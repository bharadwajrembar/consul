ARG GOLANG_VERSION=1.12.13
FROM golang:${GOLANG_VERSION}

ARG GOTOOLS="github.com/elazarl/go-bindata-assetfs/... \
   github.com/hashicorp/go-bindata/... \
   golang.org/x/tools/cmd/cover \
   golang.org/x/tools/cmd/stringer \
   github.com/axw/gocov/gocov \
   gopkg.in/matm/v1/gocov-html"

RUN GO111MODULE=on go get -u -v ${GOTOOLS} && mkdir -p /consul

WORKDIR /consul
