Manager Node Commands

```
docker service scale my_service=3
```

```
docker swarm join-token worker
```

```
docker node update --label-add role=<role> <node-id>
```

Worker Node Commands

```
docker swarm join --token <token> <host:port>
```


```
docker stack rm simple-scaler
```