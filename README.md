Minimalistic blog with Nextra

## Sync Blog

```
cd pages && git clone https://github.com/jimchen2/blog && cd blog
find . -name ".*" -not -name "." -not -name ".." -exec rm -rf {} +
cd .. && cp -r blog/* . && rm -rf blog && cd ..
```

## Build

```
npm i && npm run build
```
