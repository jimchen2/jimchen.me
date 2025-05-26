

## Github Docker Push Workflow Env Vars

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## Create PostgreSQL

```sh
docker network create pg-net
docker run -d \
  --name postgres \
  --network pg-net \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=[PASSWORD] \
  -e POSTGRES_DB=blog \
  -p 5432:5432 \
  -v ~/pg_init_scripts:/docker-entrypoint-initdb.d \
  -v pg_data:/var/lib/postgresql/data \ # Example of using a named volume for data persistence
  postgres:15
# Open port 5432
```


## Run Website

```sh
vim .env
# configure the .env
# Postgres URL for website:
# postgresql://user:PASSWORD@postgres:5432/blog?sslmode=disable
# Keep http://localhost:3000 to avoid public egress
sudo docker run -d \
--restart always \
--env-file .env \
-p 3000:3000 \
--network pg-net \
jimchen2/jimchen.me

sudo systemctl enable --now docker
```

## `nginx` and Certbot

```sh
rm /etc/nginx/sites-enabled/default
vim /etc/nginx/sites-available/jimchen.me.conf
# copy the nginx config to sites-available
sudo ln -sf /etc/nginx/sites-available/jimchen.me.conf /etc/nginx/sites-enabled/
sudo mkdir -p /var/www/html
sudo chown -R www-data:www-data /var/www/html
sudo certbot certonly --webroot -w /var/www/html -d jimchen.me
sudo systemctl enable --now nginx
```

## Schema

```
CREATE TABLE likes (
  id SERIAL PRIMARY KEY, -- Unique identifier for the likes record
  parent_id VARCHAR(255) NOT NULL, -- Identifier for the blog post (e.g., blogid)
  likes TEXT[] DEFAULT '{}', -- Array of user IPs who liked the blog post
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the record was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the record was last updated
  UNIQUE (parent_id) -- Ensure each blog post has only one likes record
);

CREATE TABLE comments (
    uuid TEXT PRIMARY KEY,
    user_name TEXT,
    text TEXT,
    blog_id TEXT,
    blog_name TEXT,
    pointer TEXT[] DEFAULT '{}',
    likes TEXT[] DEFAULT '{}',
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
