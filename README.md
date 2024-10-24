Minimalistic blog with Nextra

## Docker Build

```sh
docker build --no-cache -t jimchen2/jimchen.me .
docker run -d --restart always --env-file .env -p 3000:3000 jimchen2/jimchen.me
docker push jimchen2/jimchen.me
```

## Docker Clean

```
docker system prune -af
```

## Install

```
sudo dnf install docker git
```

## Separate User Setup

```
sudo adduser blogapp
sudo usermod -aG docker blogapp
sudo mkdir -p /opt/dockerapps/blogapp
sudo chown -R blogapp:blogapp /opt/dockerapps/blogapp
su - blogapp
```

## Dockerfile

### Sync Blog

```
cd pages && git clone https://github.com/jimchen2/blog && cd blog
find . -name ".*" -not -name "." -not -name ".." -exec rm -rf {} +
cd .. && cp -r blog/* . && rm -rf blog && cd ..
```

### Build

```
npm i && npm run build
```

### `gitignore`

```
pages/*
!pages/_app.jsx
```
