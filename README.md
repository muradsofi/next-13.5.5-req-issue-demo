1. Build the Docker image:

```sh
   docker build -t monorepo-demo -f apps/demo/Dockerfile .
```

2. Run the Docker container:

```sh
   docker run -p 3002:3000 monorepo-demo
```
