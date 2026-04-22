```shell
# Create admin token
influxdb3 create token --admin
# Setup Admin token for local operations
export INFLUXDB3_AUTH_TOKEN="apiv3_k2FJLKKiRmUOeCNp0ulISTQ9o9_S4a3fOuf4KVlBtSaQClW0teboZnj8xZlgvNXH-k6_XFPSnj_A9x53jRVyoQ"
# Configure Database
influxdb3 create database "SENSOR_DATA"
```