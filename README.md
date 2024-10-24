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

## Sync S3

```
rclone sync . s3:jimchen.me --transfers 100 -P
```

## `next.config.mjs`

```
export default {
  ...withNextra(),
  output: 'export',
  images: {
    unoptimized: true  
  }
};
```

## `gitignore`

```
pages/*
!pages/_app.jsx
```
