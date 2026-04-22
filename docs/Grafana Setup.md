Add influxdb data source

- Search 'Data Sources'
- Click 'Add new data source'
- Click Influxdb
    - Choose SQL for query language
    - URL can be 'http://influxdb:8181' using docker dns where the host is the name of the service (assuming it is set under the same network)
    - Add name of configured database and admin token and test connection
